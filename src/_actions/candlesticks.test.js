import * as actions from './candlesticks.actions';
//FETCH_CANDLESTICKS_REQUEST
//FETCH_CANDLESTICKS_SUCCESS
//FETCH_CANDLESTICKS_ERROR

describe('Connect', () => {
  const defaultParams = {
    exchangeName: 'binance',
    resolution: 15,
    since: 100,
    symbol: 'BTC/USD'
  };

  const defaultParamsIterable = ['binance', 'BTC/USD', 15, 100];

  it('creates an action for fetching candlesticks request', () => {
    const expectedAction = {
      type: actions.FETCH_CANDLESTICKS_REQUEST,
      ...defaultParams
    };

    expect(actions.fetchCandlesticksRequest(...defaultParamsIterable)).toEqual(expectedAction);
  });

  it('creates an action for fetch candlesticks success', () => {
    const expectedAction = {
      type: actions.FETCH_CANDLESTICKS_SUCCESS,
      candlesticks: [],
      ...defaultParams
    };

    const params = [[], ...defaultParamsIterable];
    expect(actions.fetchCandlesticksSuccess(...params)).toEqual(expectedAction);
  });

  it('creates an action for fetch markets error', () => {
    const expectedAction = {
      type: actions.FETCH_CANDLESTICKS_ERROR,
      ...defaultParams,
      error: {
        message: 'Error message!'
      }
    };

    const params = [{ message: 'Error message!' }, ...defaultParamsIterable];
    expect(actions.fetchCandlesticksError(...params)).toEqual(expectedAction);
  });

  it('creates an action-thunk for fetch marketcap data', () => {
    expect(actions.fetchCandlesticks(defaultParams)).toBeDefined();
  });
});
