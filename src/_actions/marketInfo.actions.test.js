import * as actions from './marketInfo.actions';

describe('Market Info ACTIONS', () => {
  it('creates an action for fetching market Info request', () => {
    const expectedAction = {
      type: actions.FETCH_MARKET_REQUEST,
      exchangeName: 'name',
      symbol: 'symbol'
    };
    expect(actions.fetchMarketRequest('name', 'symbol')).toEqual(expectedAction);
  });

  it('creates an action for fetching market Info SUCCESS', () => {
    const fakeData = { data: 'hello' };
    const expectedAction = {
      data: fakeData,
      type: actions.FETCH_MARKET_SUCCESS,
      exchangeName: 'name',
      symbol: 'symbol'
    };
    expect(actions.fetchMarketSuccess(fakeData, 'name', 'symbol')).toEqual(expectedAction);
  });

  it('creates an action for fetching market Info ERROR', () => {
    const error = 'fakeError';
    const expectedAction = {
      error,
      type: actions.FETCH_MARKET_ERROR,
      exchangeName: 'name',
      symbol: 'symbol'
    };
    expect(actions.fetchMarketError(error, 'name', 'symbol')).toEqual(expectedAction);
  });

  it('creates an action-thunk for fetching Market Info', () => {
    expect(actions.fetchMarketInfo('GDAX', 'BTC/USD')).toBeDefined();
  });
});
