import networth from './networth.reducer';
import * as actions from '../_actions/balance.actions';

describe('networth reducer', () => {
  it('returns initial state', () => {
    const expectedInitialState = {
      base: {
        meta: {
          error: false,
          loading: false
        }
      },
      meta: {
        error: false,
        loading: false
      }
    };
    expect(networth(undefined, {})).toEqual(expectedInitialState);
  });

  it('returns unmodified state for not relevant actions', () => {
    const state = {};
    expect(networth(state, { type: '@moon/DUMMY_ACTION' })).toEqual(state);
  });

  it('sets historical data on success action', () => {
    const data = {
      usd: [{ value: 77.75, date: 1536526385576 }, { value: 77.76, date: 1536526391691 }]
    };

    const action = actions.fetchHistoricalNetworthSuccess(data);

    expect(networth(undefined, action)).toEqual({
      ...data,
      base: {
        meta: {
          error: false,
          loading: false
        }
      },
      meta: {
        error: false,
        loading: false
      }
    });
  });
});
