import orderbook from './orderbook.reducer';
import * as actions from '_actions/orderbook.actions';
import { receiveMarketOrderbookData } from '_actions/markets.actions';

describe('orderbook reducer', () => {
  it('returns initial state', () => {
    const expectedState = {
      asks: [],
      bids: [],
      meta: {
        loading: true
      },
      page: {},
      precision: { amount: 8, base: 8, quote: 8, price: 8 }
    };
    expect(orderbook(undefined, {})).toEqual(expectedState);
  });

  it('returns unmodified state for not relevant actions', () => {
    const state = {
      list: [{ foo: 'bar' }],
      meta: {
        loading: true
      }
    };

    expect(orderbook(state, { type: '@moon/DUMMY_ACTION' })).toEqual(state);
  });

  it('sets meta loading state', () => {
    const initialState = {
      asks: [],
      bids: [],
      meta: {}
    };

    const expectedState = {
      ...initialState,
      meta: { loading: true }
    };

    expect(orderbook(initialState, actions.fetchOrderBookRequest())).toEqual(expectedState);
  });

  it('stores orderbook on initial fetch', () => {
    const initialState = {
      asks: [],
      bids: [],
      page: {
        bids: 2
      },
      meta: {
        loading: true
      }
    };

    const action = {
      type: actions.FETCH_ORDERBOOK_SUCCESS,
      payload: {
        orderbook: {
          asks: [[0.5, 1], [1, 1]],
          bids: [[0.8, 1], [0.3, 1]]
        }
      }
    };

    const orderData = {
      asks: [1, 2, 3],
      bids: [3, 4, 5]
    };

    const expectedState = {
      asks: [[1, 1], [0.5, 1]],
      bids: [[0.8, 1], [0.3, 1]],
      page: {},
      meta: {}
    };

    expect(orderbook(initialState, action)).toEqual(expectedState);
  });

  it('stores orderbook on ticker updates', () => {
    const initialState = {
      asks: [[0.016104, 2], [0.016101, 1]],
      bids: [[0.1, 1]],
      page: {
        bids: 2
      },
      meta: {}
    };

    const payloadOrderbookData = [
      { bid: 0.014473, amount: 0.23 },
      { bid: 0.001, amount: 2 },
      { bid: 0.1, amount: 2 },
      { ask: 0.016101, amount: 0 },
      { ask: 0.016103, amount: 1.8 },
      { ask: 0.016105, amount: 1 },
      { ask: 0.016105, amount: 1 }
    ];

    const expectedState = {
      asks: [[0.016105, 1], [0.016104, 2], [0.016103, 1.8]],
      bids: [[0.1, 2], [0.014473, 0.23], [0.001, 2]],
      page: {
        bids: 2
      },
      meta: {}
    };

    expect(orderbook(initialState, receiveMarketOrderbookData(payloadOrderbookData))).toEqual(
      expectedState
    );
  });

  it('sets meta error state and resets state on error', () => {
    const initialState = {
      asks: [[1, 1], [0.5, 1]],
      bids: [[0.8, 1], [0.3, 1]],
      page: {
        bids: 2
      },
      meta: { loading: true }
    };

    const expectedState = {
      asks: [],
      bids: [],
      page: {},
      precision: {
        amount: 8,
        base: 8,
        price: 8,
        quote: 8
      },
      meta: {
        error: true,
        errorMessage: 'Error message'
      }
    };

    const error = {
      message: 'Error message'
    };

    expect(orderbook(initialState, actions.fetchOrderBookError(error))).toEqual(expectedState);
  });
});
