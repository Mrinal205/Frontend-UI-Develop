import _ from 'lodash';
import moment from 'moment';
import 'moment-timezone';

import { getCandleSticks } from '_api';
import { getResolutions, getResolutionsConfig, getCurrencyConfig } from './symbolConfig';
import { normalizeCandlesticks } from '_reducers/candlesticks.reducer';

function parseResolution(res) {
  let minutes;

  if (res.indexOf('D') > -1) {
    minutes = parseInt(res, 10) * 24 * 60;
  } else {
    minutes = parseInt(res, 10);
  }

  return minutes * 60 * 1000;
}

function updateCandleInTimeRange(candleTime, resolution) {
  const currentTime = moment().utc();
  const resolutionInMs = parseResolution(resolution);
  return currentTime.isBefore(moment(candleTime + resolutionInMs));
}

// Implementing JS-API (see https://github.com/tradingview/charting_library/wiki/JS-Api)
class MarketChartDataProvider {
  constructor(options) {
    this.resolutions = getResolutions();

    this.configurationData = {
      exchanges: [],
      symbols_types: [{ name: 'Cryptocurrencies', value: 'crypto' }],
      supported_resolutions: this.resolutions,
      supports_marks: false,
      supports_timescale_marks: false,
      supports_time: false,
      supports_search: false,
      supports_group_request: false
    };

    this.onDataReset = options.onDataReset;

    this.subscribers = {};

    this.counters = {};
    this._data = []; //  {time, close, open, high, low, volume}
  }

  _processData(candleSticks) {
    let data = normalizeCandlesticks(candleSticks).map(bar => ({
      time: bar[0],
      open: bar[1],
      high: bar[2],
      low: bar[3],
      close: bar[4],
      volume: bar[5]
    }));

    if (data.length > 1 && data[0].time > data[1].time) {
      data = _.reverse(data);
    }

    return data;
  }

  _updateLastCandle(candle) {
    this._data[this._data.length - 1] = candle;
  }

  _resetCounters() {
    this.counters = {};
  }

  _addCounter(res) {
    this.counters[res] ? this.counters[res]++ : (this.counters[res] = 1);
  }

  _counterInLimit(res) {
    return this.counters[res] < 10;
  }

  tick(tickerData) {
    // dont update if there is no data
    if (this._data.length === 0) {
      return;
    }

    const { price } = tickerData;

    const lastCandle = this._data[this._data.length - 1];
    const updatedCandle = {
      ...lastCandle,
      high: price > lastCandle.high ? price : lastCandle.high,
      low: price < lastCandle.low ? price : lastCandle.low,
      close: price
    };

    // dont update if candle didn't change
    if (
      updatedCandle.high === lastCandle.high &&
      updatedCandle.low === lastCandle.low &&
      updatedCandle.close === lastCandle.close
    ) {
      return;
    }

    // publish updated bar to chart
    Object.values(this.subscribers).forEach(subscriber => {
      if (updateCandleInTimeRange(lastCandle.time, subscriber.resolution)) {
        subscriber.realtimeCallback(updatedCandle);
        this._updateLastCandle(updatedCandle);
      }
    });
  }

  /**
   *
   * This call is intended to provide the object filled with configuration data.
   * This data affects some of chart behavior aspects so it is called server-side customization.
   * Charting Library expects you will call callback and pass your datafeed configurationData as an argument.
   *
   * @param function
   */
  onReady(callback) {
    window.setTimeout(() => {
      callback(this.configurationData);
    }, 0);
  }

  /**
   * Charting Library will call this function when it need to get SymbolInfo by symbol's name.
   *
   * @param {String} symbolName Symbol name or ticker if provided.
   * @param {Function} onSymbolResolvedCallback
   * @param {Function } onResolveErrorCallback
   */
  resolveSymbol(symbolName, onSymbolResolvedCallback, onResolveErrorCallback) {
    const symbolData = symbolName.split(':');

    const symbolCurrencyConfig = getCurrencyConfig(symbolData[1]);
    const symbolResolutionsConfig = getResolutionsConfig(symbolName);

    const symbol = {
      exchange: symbolData[0],
      name: symbolData[1],
      ticker: symbolName,
      description: `CandleStick data for ${symbolData[1]}`,
      type: 'crypto',
      session: '24x7',
      timezone: 'Etc/UTC',
      data_status: 'streaming',
      ...symbolResolutionsConfig,
      ...symbolCurrencyConfig
    };

    // resolve on next tick
    window.setTimeout(() => {
      onSymbolResolvedCallback(symbol);
    }, 0);
  }

  /**
   * This function is called when chart needs a history fragment defined by dates range.
   * The charting library expects onHistoryCallback to be called just once after receiving all the requesting history. No further calls are expected.
   *
   * @param {SymbolInfo} symbolInfo SymbolInfo object
   * @param {String} resolution
   * @param {*} from unix timestamp, leftmost required bar time
   * @param {*} to unix timestamp, rightmost required bar time
   * @param {Function} onHistoryCallback
   *   function(array of bars, meta = { noData = false })
   *    - bar: object {time, close, open, high, low, volume}
   *    - meta: object {noData = true | false, nextTime - unix time}
   *
   * @param {Function} onErrorCallback
   * @param {boolean} firstDataRequest boolean to identify the first history call
   */
  getBars(symbolInfo, resolution, from, to, onHistoryCallback, onErrorCallback, firstDataRequest) {
    const meta = { noData: false, nextTime: null };

    if (firstDataRequest) {
      this._resetCounters();
    }

    getCandleSticks(symbolInfo.exchange, symbolInfo.name, resolution, from).then(data => {
      this._addCounter(resolution);
      if (data.candleSticks.length === 0) {
        onHistoryCallback([], { noData: true });
      } else {
        const processedData = this._processData(data.candleSticks);
        if (this._counterInLimit(resolution)) {
          this._data = processedData;
          onHistoryCallback(processedData, meta);
        } else {
          onHistoryCallback([], { noData: true });
        }
      }
    });
  }

  /**
   *
   * Charting Library calls this function when it wants to receive realtime updates for a symbol.
   * Chart expects you will call onRealtimeCallback every time you want to update the most recent bar or to append a new one.
   *
   * @param {SymbolInfo} symbol
   * @param {String} resolution
   * @param {Function} realtimeCallback
   * @param {Object} subscriberUID
   * @param {Function} resetCacheCallback
   */
  subscribeBars(symbol, resolution, realtimeCallback, subscriberUID, resetCacheCallback) {
    this.subscribers[subscriberUID] = {
      symbol,
      resolution,
      realtimeCallback,
      resetCacheCallback
    };
  }

  /**
   * Library calls this function when is doesn't want to receive updates for this subscriber any more.
   * subscriberUID will be the same object which Library passed to subscribeBars before.
   *
   * @param {Object} subscriberUID
   */
  unsubscribeBars(subscriberUID) {
    delete this.subscribers[subscriberUID];
  }
}

export default MarketChartDataProvider;
