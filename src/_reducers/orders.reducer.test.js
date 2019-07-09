import reducer from './orders.reducer';
import { actionNames } from '../_actions/ids';

describe('orders reducer', () => {
  const initialState = {};

  it('returns initial state', () => {
    expect(reducer(undefined, {})).toEqual({ meta: {} });
  });

  it('ignores dummy action type', () => {
    expect(reducer(initialState, { type: '@moon/DUMMY_ACTION' })).toEqual(initialState);
  });

  it('udpates balance on fetchOrders.success', () => {
    const action = {
      type: actionNames.fetchOrders.success,
      payload: {
        symbol: 'ETH-BTC',
        exchangeName: 'BINANCE',
        resp: {
          open: [
            {
              amount: 1,
              symbolPair: 'ETH/BTC',
              offerType: 'BUY'
            }
          ],
          closed: []
        }
      }
    };

    const expectedState = {
      BINANCE: {
        'ETH-BTC': {
          closed: [],
          open: [
            {
              exchangeLabel: 'Binance',
              amount: 1,
              symbolPair: 'ETH/BTC',
              offerType: 'BUY'
            }
          ],
          justClosed: []
        }
      }
    };

    expect(reducer(initialState, action)).toEqual(expectedState);
  });

  it('cancel order request', () => {
    const action = {
      type: actionNames.cancelOrder.request,
      payload: {
        order: {
          id: null,
          exchangeOrderId: 456
        }
      }
    };

    const expectedState = {
      meta: {
        deleting: {
          id: null,
          exchangeOrderId: 456
        }
      }
    };

    expect(reducer(initialState, action)).toEqual(expectedState);
  });

  it('cancel order success', () => {
    const state = {
      BINANCE: {
        'ETH/BTC': {
          open: [
            {
              exchangeOrderId: 456
            }
          ]
        }
      }
    };

    const action = {
      type: actionNames.cancelOrder.success,
      payload: {
        exchangeName: 'BINANCE',
        symbol: 'ETH/BTC',
        order: {
          id: null,
          exchangeOrderId: 456
        }
      }
    };

    const expectedState = {
      meta: {
        deleting: null
      },
      BINANCE: {
        'ETH/BTC': {
          open: [],
          closed: []
        }
      }
    };

    expect(reducer(state, action)).toEqual(expectedState);
  });
});
