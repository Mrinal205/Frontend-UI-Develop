import marketcap from './marketcap.reducer';
import * as actions from '../_actions/marketcap.actions';

describe('marketcap reducer', () => {
  it('returns initial state', () => {
    const expectedInitialState = {
      meta: {}
    };
    expect(marketcap(undefined, {})).toEqual(expectedInitialState);
  });

  it('returns unmodified state for not relevant actions', () => {
    const state = {
      meta: {
        loading: true
      }
    };

    expect(marketcap(state, { type: '@moon/DUMMY_ACTION' })).toEqual(state);
  });

  it('sets meta loading state', () => {
    const initialState = {
      meta: {}
    };

    const expectedState = {
      meta: { loading: true }
    };

    expect(marketcap(initialState, actions.fetchMarketcapOverviewRequest())).toEqual(expectedState);
  });

  it('stores marketcap data', () => {
    const initialState = {
      meta: {
        loading: true
      }
    };

    const payload = {
      total_market_cap_usd: 10
    };

    const expectedState = {
      ...payload,
      meta: {}
    };

    expect(marketcap(initialState, actions.fetchMarketcapOverviewSuccess(payload))).toEqual(
      expectedState
    );
  });

  it('sets meta error state', () => {
    const initialState = {
      meta: { loading: true }
    };

    const expectedState = {
      meta: {
        error: true,
        errorMessage: 'Error message'
      }
    };

    const errorPayload = {
      message: 'Error message'
    };

    expect(marketcap(initialState, actions.fetchMarketcapOverviewError(errorPayload))).toEqual(
      expectedState
    );
  });
});
