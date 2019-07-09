import * as actions from './marketcap.actions';

describe('Connect', () => {
  it('creates an action for fetching marketcap request', () => {
    const expectedAction = {
      type: actions.FETCH_MARKETCAP_REQUEST,
      exchange: {}
    };

    expect(actions.fetchMarketcapOverviewRequest({})).toEqual(expectedAction);
  });

  it('creates an action for fetch marketcap success', () => {
    const expectedAction = {
      type: actions.FETCH_MARKETCAP_SUCCESS,
      marketcap: {}
    };

    expect(actions.fetchMarketcapOverviewSuccess({})).toEqual(expectedAction);
  });

  it('creates an action for fetch marketcap error', () => {
    const expectedAction = {
      type: actions.FETCH_MARKETCAP_ERROR,
      error: {
        message: 'Error message!'
      }
    };

    expect(actions.fetchMarketcapOverviewError({ message: 'Error message!' })).toEqual(
      expectedAction
    );
  });

  it('creates an action-thunk for fetch marketcap data', () => {
    expect(actions.fetchMarketcapOverview()).toBeDefined();
  });
});
