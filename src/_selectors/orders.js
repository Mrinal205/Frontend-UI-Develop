import { createSelector } from 'reselect';
import { get } from 'lodash/object';

import { OrdersListLimit, OrdersListAll, AllExchangesData } from '_constants';

export const getOrders = state => state.orders;
export const getExchanges = state => state.exchanges;
export const getSelectedExchange = (state, selectedExchange) => selectedExchange.exchangeName;
export const getSelectedMarket = (state, selectedExchange, marketName) => marketName;

/**
 * Returns only quote currency values for market list (used in dropdown filtering)
 */
export const consolidatedOrders = createSelector(
  [getOrders, getExchanges, getSelectedExchange],
  (orders, exchangesData, exchangeName) => {
    const { meta, ...exchanges } = orders;

    const [openOrders, closedOrders] = ['open', 'closed'].map(type => {
      const list = [];

      const toIterate =
        exchangeName === AllExchangesData.exchangeName ? Object.keys(exchanges) : [exchangeName];

      toIterate.forEach(exchange => {
        let name = exchange;
        const exchangeObj = exchangesData.find(ex => ex.exchangeName === exchange);
        if (exchangeObj) {
          name = exchangeObj.exchangeName;
        }
        // safely check if the exchange has orders
        const items = get(exchanges, `${exchange}.${type}`, []).map(it => ({ ...it, name }));
        list.push(...items);
      });

      return list.sort((a, b) => b.timestamp - a.timestamp);
    });

    return { openOrders, closedOrders, meta };
  }
);

export const paginatedOrders = createSelector(
  [consolidatedOrders],
  ({ openOrders: open, closedOrders: closed, meta }) => {
    return paginate(open, closed, meta);
  }
);

export const paginatedOrdersByMarket = createSelector(
  [getOrders, getSelectedExchange, getSelectedMarket],
  (orders, exchangeName, marketName) => {
    const { open = [], closed = [] } = get(orders, `${exchangeName}.${marketName}`, {});
    return paginate(open, closed, orders.meta);
  }
);

function paginate(open, closed, meta) {
  const maxOrderPages = {};
  const [openOrders, closedOrders] = [open, closed].map(list => {
    const page = meta[list === open ? 'openOrdersPage' : 'closedOrdersPage'] || 0;
    if (page === OrdersListAll) {
      maxOrderPages[list === open ? 'open' : 'closed'] = 1;
      return list;
    }
    const maxPages = Math.ceil(list.length / OrdersListLimit);
    maxOrderPages[list === open ? 'open' : 'closed'] = maxPages;
    const skip = page * OrdersListLimit;
    return list.slice(skip, skip + OrdersListLimit);
  });
  return { openOrders, closedOrders, maxOrderPages };
}
