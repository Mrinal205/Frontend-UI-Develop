import { createSelector } from 'reselect';
import { get } from 'lodash/object';

import { getCurrency } from '_helpers';
import { AllExchangesData } from '_constants';
import { formatUsd, formatCurrency } from '_helpers/formatting';

export const getBalance = state => state.trading.balance;
export const getExchanges = state => state.exchanges;
export const getMarkets = state => state.markets;
export const getSelectedExchange = (state, selectedExchange) => selectedExchange.exchangeName;

/**
 * Returns only quote currency values for market list (used in dropdown filtering)
 */
export const consolidatedBalance = createSelector(
  [getBalance, getExchanges, getSelectedExchange],
  (balance, exchanges, selectedExchange) => {
    const list = [];

    const toIterate =
      selectedExchange === AllExchangesData.exchangeName
        ? Object.keys(balance)
        : [selectedExchange];

    toIterate.forEach(exchange => {
      const exchangeData = exchanges.find(ex => ex.exchangeName === exchange);
      const exchangeCoins = get(exchangeData, 'coins', []);

      Object.keys(balance[exchange] || {}).forEach(coin => {
        const market = exchangeCoins.find(c => c.base === coin) || {};
        const total = balance[exchange][coin];
        if (total) {
          list.push({
            exchange,
            exchangeLabel: exchangeData.label,
            coin,
            ...total,
            quotes: market.quotes || [],
            name: getCurrency(coin)
          });
        }
      });
    });
    return list;
  }
);

export const consolidatedValueBalance = createSelector(
  [consolidatedBalance, getMarkets],
  (balance, markets) => {
    const consolidated = {
      total: { usd: 0, btc: 0 },
      available: { usd: 0, btc: 0 },
      reserved: { usd: 0, btc: 0 }
    };
    let totalBTC = 0;
    let totalUSD = 0;

    balance.forEach(item => {
      const marketList = get(markets, `${item.exchange}.list`, {});

      // Pairs we'll use to compute usd value
      const usdCoinPair = marketList[`${item.coin}/USD`] || marketList[`${item.coin}/USDT`];
      const usdPair = marketList['BTC/USD'] || marketList['BTC/USDT'];

      // Pairs we'll use to compute btc value
      const btcPair = marketList[`${item.coin}/BTC`];
      const reverseBtcPair = marketList[`BTC/${item.coin}`];

      if (item.coin === 'BTC') {
        item.btcValue = item.total;
      } else if (btcPair) {
        item.btcValue = item.total * btcPair.price;
      } else if (reverseBtcPair) {
        item.btcValue = item.total * (1 / reverseBtcPair.price);
      }

      if (item.coin === 'USD' || item.coin === 'USDT') {
        item.usdValue = item.total;
      } else if (usdCoinPair) {
        item.usdValue = item.total * usdCoinPair.price;
      } else if (item.btcValue && usdPair) {
        item.usdValue = item.btcValue * usdPair.price;
      }

      if (!item.btcValue && item.usdValue && usdPair) {
        item.btcValue = item.usdValue / usdPair.price;
      }
      // calculate totals and add formatting
      consolidated.total.btc += item.btcValue || 0;
      consolidated.total.usd += item.usdValue || 0;
      if (item.reserved) {
        consolidated.reserved.btc += (item.reserved / item.total) * (item.btcValue || 0);
        consolidated.reserved.usd += (item.reserved / item.total) * (item.usdValue || 0);
      }
      consolidated.available.btc += (item.available / item.total) * (item.btcValue || 0);
      consolidated.available.usd += (item.available / item.total) * (item.usdValue || 0);

      totalBTC += item.btcValue || 0;
      totalUSD += item.usdValue || 0;
    });

    return {
      balance: balance.sort((a, b) => b.usdValue - a.usdValue).map(item => ({
        ...item,
        total: formatCurrency(item.total),
        btcValue: item.btcValue && formatCurrency(item.btcValue, { symbol: 'BTC' }),
        usdValue: item.usdValue && formatUsd(item.usdValue)
      })),
      totalUSD,
      totalBTC,
      consolidated
    };
  }
);
