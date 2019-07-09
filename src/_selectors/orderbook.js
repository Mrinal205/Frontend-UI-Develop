import { createSelector } from 'reselect';
import _ from 'lodash';

import { OrderbookRowLimit } from '_constants';

export const getOrderbook = state => state.orderbook;

/**
 * Returns only quote currency values for market list (used in dropdown filtering)
 */
export const orderbookByPrecisionSelector = createSelector([getOrderbook], orderbook => {
  const { bids: rawBids, asks: rawAsks, precision } = orderbook;
  const multiplier = Math.pow(10, precision.price ? precision.price : 8);

  const [bids, asks] = [rawBids, rawAsks]
    .map(list => {
      const priceTotalMap = list.reduce((prev, row) => {
        const key = Math.floor(row[0] * multiplier);
        const prevItem = prev[prev.length - 1];
        if (prevItem && prevItem[0] === key) {
          prevItem[1] += row[1];
          prevItem[2] += row[1] * row[0];
        } else {
          prev.push([key, row[1], row[1] * row[0]]);
        }
        return prev;
      }, []);

      return list === rawBids
        ? priceTotalMap.slice(0, OrderbookRowLimit)
        : priceTotalMap.slice(priceTotalMap.length - OrderbookRowLimit);
    })
    .map((data, i) => transformForPresentation(data, multiplier, precision));

  return { asks, bids, orderbook };
});

/**
 * Formats the raw data values with applied precision
 */
function transformForPresentation(data, multiplier, precision = { base: 8, amount: 8, price: 8 }) {
  const maxAmount = Math.max(...data.map(item => item[1]));
  const items = data.map(item => {
    const [integerPrice, amount, total] = item;
    const price = integerPrice / multiplier;

    return {
      amount: amount.toFixed(precision.amount),
      price: price.toFixed(precision.price),
      total: total.toFixed(precision.base),
      volume: _.round((amount / maxAmount) * 100, 2)
    };
  });

  return items;
}
