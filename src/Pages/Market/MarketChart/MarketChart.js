import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { throttle } from 'lodash/function';

import { CHART_THROTTLE_UPDATE_VALUE } from '_constants/';
import MarketChartDataProvider from './MarketChartDataProvider';
import createWidgetConfig from './config';

import './MarketChart.scss';

const resolutions = [
  { value: '1', label: '1 min' },
  { value: '5', label: '5 min' },
  { value: '15', label: '15 min' },
  { value: '30', label: '30 min' },
  { value: '60', label: '1 hour' },
  { value: '240', label: '4 hours' },
  { value: '1D', label: '1 day' },
  { value: '5D', label: '5 days' },
  { value: '7D', label: '1 week' }
];

const STYLE_CANDLES = 1;
const STYLE_AREA = 3;

/**
 * Helper function to mark custom widget buttons as selected
 * @param {jQuery} button
 */
function markAsSelected(button, className = 'selected') {
  button
    .parent()
    .parent()
    .find(`.${className}`)
    .removeClass(className);
  button.addClass(className);
}

export class MarketChart extends Component {
  constructor(props) {
    super(props);

    this.setResolution = this.setResolution.bind(this);
    this.onChartReady = this.onChartReady.bind(this);
    this.renderButtons = this.renderButtons.bind(this);
    this.resetData = this.resetData.bind(this);
    this.pushLatestData = throttle(this.pushLatestData.bind(this), CHART_THROTTLE_UPDATE_VALUE);

    this.state = {
      chartType: STYLE_AREA,
      isReady: false,
      resolution: '30'
    };

    // create instance of data provider
    this.chartDataProvider = new MarketChartDataProvider({
      onDataReset: this.resetData
    });

    this.widget = null;
  }

  componentDidMount() {
    if (this.props.symbol) {
      this.initWidget(this.props.symbol);
    }
  }

  componentDidUpdate(oldProps) {
    const { market, symbol } = this.props;
    if (symbol !== oldProps.symbol) {
      if (this.widget) {
        this.updateWidget(symbol);
      } else {
        this.initWidget(symbol);
      }
    }

    if (market) {
      this.pushLatestData(market);
    }
  }

  componentWillUnmount() {
    this.removeOldWidget();
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      nextProps.market !== this.props.market ||
      nextProps.symbol !== this.props.symbol ||
      nextState.chartType !== this.state.chartType ||
      nextState.isReady !== this.state.isReady ||
      nextState.resolution !== this.state.resolution
    );
  }

  initWidget(symbol) {
    const widgetOptions = createWidgetConfig({
      symbol: symbol,
      interval: this.state.resolution,
      timeframe: '1D',
      datafeed: this.chartDataProvider,
      height: 460
    });

    // create TradinvView widget instance
    this.widget = new window.TradingView.widget(widgetOptions);
    this.widget.onChartReady(this.onChartReady);
    this.setState({ isReady: true });
  }

  updateWidget(symbol) {
    this.widget.activeChart().setSymbol(symbol);
  }

  resetData() {
    this.widget.activeChart().resetData();
  }

  removeOldWidget() {
    if (this.widget) {
      try {
        this.widget.remove();
        this.widget = undefined;
      } catch (err) {}
    }
  }

  onChartReady() {
    this.widget.activeChart().setChartType(STYLE_AREA);
    this.renderButtons();
    this.widget
      .activeChart()
      .onDataLoaded()
      .subscribe(this, () => {
        this.widget.applyOverrides({ 'timeScale.rightOffset': 0 });
      });
  }

  renderButtons() {
    // append line button
    const lineButton = this.widget
      .createButton()
      .on('click', () => {
        markAsSelected(lineButton, 't-selected');
        this.setState({ chartType: STYLE_AREA });
        this.widget.chart().setChartType(STYLE_AREA);
      })
      .addClass('t-selected')
      .append('<span>Line</span>');

    // append candles button
    const candlesButton = this.widget
      .createButton()
      .on('click', () => {
        markAsSelected(candlesButton, 't-selected');
        this.setState({ chartType: STYLE_CANDLES });
        this.widget.chart().setChartType(STYLE_CANDLES);
      })
      .append('<span>Candle</span>');

    // append custom buttons
    resolutions.forEach(res => {
      const button = this.widget.createButton();
      if (res.value === this.state.resolution) {
        button.addClass('selected');
      }

      button.on('click', () => {
        markAsSelected(button);
        this.setResolution(res.value);
      });
      button.append(`<span>${res.label}</span>`);
    });
  }

  setResolution(value) {
    this.setState({ resolution: value }, () => {
      this.widget.setSymbol(this.props.symbol, value);
    });
  }

  pushLatestData(marketData) {
    this.chartDataProvider.tick(marketData);
  }

  render() {
    const cssClass = classnames('MarketChart', {
      'MarketChart--is-ready': this.state.isReady
    });

    return (
      <div className={cssClass}>
        <div id="MarketChartNode" className="MarketChart__node" />
      </div>
    );
  }
}

MarketChart.propTypes = {
  market: PropTypes.object,
  symbol: PropTypes.string.isRequired
};

export default MarketChart;
