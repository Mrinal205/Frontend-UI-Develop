import * as actions from './markets.actions';

describe('Connect', () => {
  it('creates an action for fetching markets request', () => {
    const expectedAction = {
      type: '@moon/FETCH_MARKETS_REQUEST',
      exchangeName: {}
    };

    expect(actions.fetchMarketsRequest({})).toEqual(expectedAction);
  });

  it('creates an action for fetch markets success', () => {
    const expectedAction = {
      type: '@moon/FETCH_MARKETS_SUCCESS',
      markets: {}
    };

    expect(actions.fetchMarketsSuccess({})).toEqual(expectedAction);
  });

  it('creates an action for fetch markets error', () => {
    const expectedAction = {
      type: '@moon/FETCH_MARKETS_ERROR',
      error: {
        message: 'Error message!'
      }
    };

    expect(actions.fetchMarketsError({ message: 'Error message!' })).toEqual(expectedAction);
  });

  it('creates an action-thunk for fetch markets', () => {
    expect(actions.fetchMarkets('GDAX', 'BTC/USD')).toBeDefined();
  });
});

describe('Subscribe', () => {
  it('creates an action for subscribing market ticker request', () => {
    const expectedAction = {
      type: '@moon/SUBSCRIBE_MARKET_REQUEST'
    };
    expect(actions.subscribeMarketRequest()).toEqual(expectedAction);
  });

  it('creates an action for subscribing market ticker success', () => {
    const expectedAction = {
      type: '@moon/SUBSCRIBE_MARKET_SUCCESS'
    };

    expect(actions.subscribeMarketSuccess()).toEqual(expectedAction);
  });

  it('creates an action for subscribing market ticker error', () => {
    const expectedAction = {
      type: '@moon/SUBSCRIBE_MARKET_ERROR',
      error: {
        message: 'Error message!'
      }
    };

    expect(actions.subscribeMarketError({ message: 'Error message!' })).toEqual(expectedAction);
  });

  it('creates an action-thunk for subscribing to market ticker connection', () => {
    expect(actions.subscribeMarket('GDAX', 'BTC/USD')).toBeDefined();
  });
});

describe('Receive', () => {
  it('creates an action for receiving market ticker data', () => {
    const expectedAction = {
      type: '@moon/RECEIVE_MARKET_TICKER_DATA',
      tickerData: {}
    };

    expect(actions.receiveMarketTickerData({})).toEqual(expectedAction);
  });

  it('creates an action for error receiving market ticker', () => {
    const expectedAction = {
      type: '@moon/RECEIVE_MARKET_TICKER_ERROR',
      error: {
        message: 'Error message!'
      }
    };

    expect(actions.receiveMarketTickerError({ message: 'Error message!' })).toEqual(expectedAction);
  });
});
