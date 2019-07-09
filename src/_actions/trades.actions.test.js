import * as actions from './trades.actions';

describe('Fetch', () => {
  it('creates an action for fetching trades request', () => {
    const expectedAction = {
      type: '@moon/FETCH_TRADES_REQUEST',
      payload: {
        exchange: 'GDAX',
        market: 'BTC/USD'
      }
    };

    expect(actions.fetchTradesRequest('GDAX', 'BTC/USD')).toEqual(expectedAction);
  });

  it('creates an action for fetch trades success', () => {
    const expectedAction = {
      type: '@moon/FETCH_TRADES_SUCCESS',
      payload: {
        trades: []
      }
    };

    expect(actions.fetchTradesSuccess([])).toEqual(expectedAction);
  });

  it('creates an action for fetch trades error', () => {
    const expectedAction = {
      type: '@moon/FETCH_TRADES_ERROR',
      payload: {
        error: {
          message: 'Error message!'
        }
      }
    };

    expect(actions.fetchTradesError({ message: 'Error message!' })).toEqual(expectedAction);
  });

  it('creates an action-thunk for fetch trades', () => {
    expect(actions.fetchTrades('GDAX', 'BTC/USD')).toBeDefined();
  });
});
