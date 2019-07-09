import trades from './trades.reducer';
import * as actions from '../_actions/trades.actions';

describe('trades reducer', () => {
  it('returns initial state', () => {
    const expectedState = {
      list: [],
      meta: {}
    };
    expect(trades(undefined, {})).toEqual(expectedState);
  });

  it('returns unmodified state for not relevant actions', () => {
    const state = {
      list: [{ foo: 'bar' }],
      meta: {
        loading: true
      }
    };

    expect(trades(state, { type: '@moon/DUMMY_ACTION' })).toEqual(state);
  });

  it('sets meta loading state', () => {
    const initialState = {
      list: [],
      meta: {}
    };

    const expectedState = {
      ...initialState,
      meta: { loading: true }
    };

    expect(trades(initialState, actions.fetchTradesRequest())).toEqual(expectedState);
  });

  it('stores list of trades', () => {
    const initialState = {
      list: [],
      meta: {
        loading: true
      }
    };

    const tradesData = [{ id: 1, info: {} }, { id: 2, info: {} }];

    const expectedState = {
      list: [...tradesData],
      meta: {}
    };

    expect(trades(initialState, actions.fetchTradesSuccess(tradesData))).toEqual(expectedState);
  });

  it('sets meta error state and reset list on fetch errors', () => {
    const initialState = {
      list: [{ id: 1, info: {} }],
      meta: { loading: true }
    };

    const expectedState = {
      list: [],
      meta: {
        error: true,
        errorMessage: 'Error message'
      }
    };

    const error = {
      message: 'Error message'
    };

    expect(trades(initialState, actions.fetchTradesError(error))).toEqual(expectedState);
  });
});
