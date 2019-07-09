import { get } from 'lodash/object';
import { createAction } from 'redux-actions';

import { rpcIds, actionNames, actionIds } from '_actions/ids';
import { createRPCAction, createPeriodicalRPCAction, stopPeriodicalRPCAction } from '_helpers/rpc';
import { postOrder, getOrders, deleteOrder, getExchangeOrders } from '_api/backend';
import { createNotification } from './notifications.actions';
import { fetchBalance } from './balance.actions';
import { NotificationTypes, OrderStatusTypes, TimeoutBeforeOrderPlaced } from '_constants';
import { getTradingPair } from '_helpers';
import { FetchOrdersTimeoutMs } from '_constants/timeouts';

export const initializeOrderValues = createAction(actionIds.initializeOrderValues);
export const changeOrderValue = createAction(actionIds.changeOrderValue);
export const rejectOrder = createAction(actionIds.rejectOrder);

export const submitOrder = ({ order, form }) => dispatch => {
  dispatch(createRPCAction(rpcIds.submitOrder, postOrder, { order, form })).then(action => {
    if (action.type === actionNames[rpcIds.submitOrder].success) {
      dispatch(
        createNotification({ ...action.payload.order, type: NotificationTypes.ORDER_PLACED })
      );
      setTimeout(() => {
        const { base, quote } = getTradingPair(order.symbolPair);
        dispatch(fetchOrders(order.exchangeName, order.symbolPair));
        dispatch(fetchBalance(order.exchangeName, [base, quote]));
      }, TimeoutBeforeOrderPlaced);
    }
  });
};

export const fetchOrders = (exchangeName, symbol) =>
  createPeriodicalRPCAction(
    rpcIds.fetchOrders,
    getOrders,
    { exchangeName, symbol },
    ({ type, payload }, dispatch, getState) => {
      if (type === actionNames[rpcIds.fetchOrders].success) {
        const state = getState();
        // check for open orders that are closed now
        // so we can notify the user of a status change
        const stateOpenOrders = get(state.orders, `${exchangeName}.${symbol}.open`, []);
        const actionClosedOrders = get(payload, 'resp.closed', []).reduce((prev, order) => {
          return {
            ...prev,
            [order.exchangeOrderId]: order
          };
        }, {});
        if (stateOpenOrders.length) {
          // get a map of closed orders
          stateOpenOrders.forEach(order => {
            if (actionClosedOrders.hasOwnProperty(order.exchangeOrderId)) {
              const orderToNotify = actionClosedOrders[order.exchangeOrderId];
              dispatch(
                createNotification({
                  ...orderToNotify,
                  // TODO: symbol should be included in the backend response
                  symbolPair: symbol,
                  type:
                    orderToNotify.status === OrderStatusTypes.CANCELED
                      ? NotificationTypes.ORDER_CANCELED
                      : NotificationTypes.ORDER_FILLED
                })
              );
            }
          });
        }

        if (state.orders[exchangeName] && state.orders[exchangeName][symbol]) {
          const justClosed = state.orders[exchangeName][symbol].justClosed;
          if (justClosed) {
            justClosed.forEach(closed => {
              dispatch(
                createNotification({
                  ...closed,
                  type: NotificationTypes.ORDER_FILLED
                })
              );
            });
          }
        }

        // if there are open orders we'll refresh every 10 secs, otherwise 60
        const actionOpenOrders = get(payload, 'resp.open.length', 0);
        return actionOpenOrders
          ? FetchOrdersTimeoutMs.withOpenOrders
          : FetchOrdersTimeoutMs.success;
      } else {
        // if the action failed, we'll retry in 15 seconds
        // as the server might be busy
        return FetchOrdersTimeoutMs.failure;
      }
    }
  );

export const stopFetchOrders = () => stopPeriodicalRPCAction(rpcIds.fetchOrders);

export const fetchExchangeOrders = exchangeName =>
  createRPCAction(rpcIds.fetchExchangeOrders, getExchangeOrders, { exchangeName });

export const setCurrentTradingMarket = payload => {
  return {
    type: actionIds.setCurrentTradingMarket,
    meta: { field: 'selectedMarket' },
    payload
  };
};

export const cancelOrder = (order, exchangeName, symbol) => dispatch => {
  dispatch(createRPCAction(rpcIds.cancelOrder, deleteOrder, { order, exchangeName, symbol })).then(
    action => {
      if (action.type === actionNames[rpcIds.cancelOrder].success) {
        dispatch(
          createNotification({ ...action.payload.order, type: NotificationTypes.ORDER_CANCELED })
        );
        // dispatch(fetchExchangeOrders(exchangeName));
        setTimeout(() => {
          const { base, quote } = getTradingPair(order.symbolPair);
          dispatch(fetchBalance(exchangeName, [base, quote]));
        }, TimeoutBeforeOrderPlaced);
      }
    }
  );
};

export const selectOrdersPage = createAction(actionIds.selectOrdersPage);
