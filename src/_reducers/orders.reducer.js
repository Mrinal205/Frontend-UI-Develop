import reduceReducers from 'reduce-reducers';
import { get } from 'lodash/object';
import { handleActions } from 'redux-actions';

import { rpcIds, actionIds } from '_actions/ids';
import { createRPCReducer } from '_helpers/rpc';

import { AVAILABLE_EXCHANGES } from '_constants';

const initialState = {
  meta: {}
};

function mapExchangeLabels(orders, exchangeName) {
  const exchangeLabel = AVAILABLE_EXCHANGES.find(e => e.exchangeName === exchangeName).label;
  const sortedOrders = orders.sort((a, b) => b.timestamp - a.timestamp);

  return sortedOrders.map(order => ({
    ...order,
    exchangeLabel: exchangeLabel
  }));
}

export default reduceReducers(
  (state, action) => state || initialState,
  handleActions(
    {
      [actionIds.selectOrdersPage]: (state, action) => {
        const { list, page } = action.payload;
        return {
          ...state,
          meta: {
            ...state.meta,
            [list === 'open' ? 'openOrdersPage' : 'closedOrdersPage']: page
          }
        };
      }
    },
    initialState
  ),

  createRPCReducer(rpcIds.fetchExchangeOrders, {
    request: (state, action) => {
      const { exchangeName } = action.payload;
      return {
        ...state,
        meta: {
          loading: {
            ...state.meta.loading,
            [exchangeName]: true
          }
        }
      };
    },
    success: (state, action) => {
      const {
        exchangeName,
        resp: { open, closed }
      } = action.payload;
      // we accumulate exchange being loaded in a map
      // when the map is empty it means that there are not loading exchanges anymore
      const loading = { ...state.meta.loading };
      delete loading[exchangeName];

      return {
        ...state,
        [exchangeName]: {
          open: mapExchangeLabels(open, exchangeName),
          closed: mapExchangeLabels(closed, exchangeName)
        },
        meta: {
          ...state.meta,
          loading: Object.keys(loading).length ? { ...loading } : false
        }
      };
    }
  }),

  createRPCReducer(rpcIds.fetchOrders, {
    success: (state, action) => {
      const {
        exchangeName,
        symbol,
        resp: { open, closed }
      } = action.payload;

      let oldOpenOrders = [];
      if (state && state[exchangeName] && state[exchangeName][symbol]) {
        oldOpenOrders = state[exchangeName][symbol].open || [];
      }

      const justClosed = oldOpenOrders.filter(openOrder => {
        // const openId = openOrder.exchangeOrderId;
        let shouldFilter = false;
        closed.forEach(closedOrder => {
          if (openOrder.exchangeOrderId === closedOrder.exchangeOrderId) {
            shouldFilter = true;
          }
        });
        return shouldFilter;
      });

      return {
        ...state,
        [exchangeName]: {
          ...(state[exchangeName] || {}),
          [symbol]: {
            open: mapExchangeLabels(open, exchangeName),
            closed: mapExchangeLabels(closed, exchangeName),
            justClosed: mapExchangeLabels(justClosed, exchangeName)
          }
        }
      };
    }
  }),

  createRPCReducer(rpcIds.submitOrder, {
    success: (state, action) => {
      const {
        order: { exchangeName, symbolPair: symbol },
        resp: { data: newOrder }
      } = action.payload;

      // adding new order to the current list
      const open = [
        {
          ...newOrder,
          filled: 0,
          timestamp: newOrder.timestamp || new Date()
        },
        ...get(state, `${exchangeName}.${symbol}.open`, [])
      ];

      return {
        ...state,
        [exchangeName]: {
          ...(state[exchangeName] || {}),
          [symbol]: {
            open,
            closed: get(state, `${exchangeName}.${symbol}.closed`, [])
          }
        }
      };
    }
  }),

  createRPCReducer(rpcIds.cancelOrder, {
    request: (state, action) => {
      const {
        order: { exchangeOrderId, id }
      } = action.payload;
      return {
        ...state,
        meta: {
          ...state.meta,
          deleting: {
            id,
            exchangeOrderId
          }
        }
      };
    },
    success: (state, action) => {
      const {
        exchangeName,
        symbol,
        order: { exchangeOrderId, id }
      } = action.payload;

      // TODO: needs cleaner orders tree
      const existingOrders = state[exchangeName].open
        ? state[exchangeName].open
        : state[exchangeName][symbol].open;

      const updatedOpenOrders = existingOrders.filter(
        order => (Boolean(id) ? order.id !== id : order.exchangeOrderId !== exchangeOrderId)
      );

      if (state[exchangeName].open) {
        return {
          ...state,
          meta: {
            ...state.meta,
            deleting: null
          },
          [exchangeName]: {
            ...(state[exchangeName] || {}),
            open: updatedOpenOrders
          }
        };
      } else {
        return {
          ...state,
          meta: {
            ...state.meta,
            deleting: null
          },
          [exchangeName]: {
            ...(state[exchangeName] || {}),
            [symbol]: {
              open: updatedOpenOrders,
              closed: get(state, `${exchangeName}.${symbol}.closed`, [])
            }
          }
        };
      }
    }
  })
);
