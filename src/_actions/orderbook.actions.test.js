import * as actions from './orderbook.actions';

describe('Fetch', () => {
  it('creates an action for fetching orderbook request', () => {
    const expectedAction = {
      type: '@moon/FETCH_ORDERBOOK_REQUEST'
    };

    expect(actions.fetchOrderBookRequest('GDAX', 'BTC/USD')).toEqual(expectedAction);
  });

  it('creates an action for fetch orderbook success', () => {
    const expectedAction = {
      type: '@moon/FETCH_ORDERBOOK_SUCCESS',
      payload: {
        orderbook: {
          bids: [],
          asks: []
        }
      }
    };

    const responseData = {
      bids: [],
      asks: []
    };

    expect(actions.fetchOrderBookSuccess(responseData)).toEqual(expectedAction);
  });

  it('creates an action for fetch orderbook error', () => {
    const expectedAction = {
      type: '@moon/FETCH_ORDERBOOK_ERROR',
      payload: {
        error: {
          message: 'Error message!'
        }
      }
    };

    expect(actions.fetchOrderBookError({ message: 'Error message!' })).toEqual(expectedAction);
  });

  it('creates an action-thunk for fetch orderbook', () => {
    expect(actions.fetchOrderBook('GDAX', 'BTC/USD')).toBeDefined();
  });
});

describe('Set orderbook actions', () => {
  it('create selectOrderbookPage action', () => {
    const action = actions.selectOrderbookPage('test', 1);
    const expectedAction = {
      type: actions.SELECT_ORDERBOOK_PAGE,
      payload: {
        area: 'test',
        page: 1
      }
    };
    expect(action).toEqual(expectedAction);
  });

  it('create selectOrderbookPrice action', () => {
    const action = actions.selectOrderbookPrice(1, 'BINANCE');
    const expectedAction = {
      type: actions.SELECT_ORDERBOOK_PRICE,
      payload: {
        price: 1,
        exchangeName: 'BINANCE'
      },
      meta: {
        field: 'price'
      }
    };
    expect(action).toEqual(expectedAction);
  });

  it('create selectOrderbookPrecision action', () => {
    const action = actions.selectOrderbookPrecision(1);
    const expectedAction = {
      type: actions.SELECT_ORDERBOOK_PRECISION,
      payload: { precision: 1 }
    };
    expect(action).toEqual(expectedAction);
  });
});
