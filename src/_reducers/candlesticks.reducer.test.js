import candlesticks from './candlesticks.reducer';
import * as actions from '../_actions/candlesticks.actions';

describe('candlesticks reducer', () => {
  const initialState = {
    list: {},
    meta: {}
  };

  it('returns initial state', () => {
    expect(candlesticks(undefined, {})).toEqual(initialState);
  });

  it('returns unmodified state for not relevant actions', () => {
    expect(candlesticks(initialState, { type: '@moon/DUMMY_ACTION' })).toEqual(initialState);
  });

  it('sets meta loading state for requested pair/exchange', () => {
    const action = {
      type: actions.FETCH_CANDLESTICKS_REQUEST,
      exchangeName: 'binance',
      symbol: 'BTC/USD'
    };

    const expectedState = {
      list: {},
      meta: {
        'BTC/USD': {
          binance: {
            loading: true
          }
        }
      }
    };

    expect(candlesticks(initialState, action)).toEqual(expectedState);
  });

  it('stores candlestick and loading for requested pair/exchange', () => {
    const action = {
      type: actions.FETCH_CANDLESTICKS_SUCCESS,
      exchangeName: 'binance',
      symbol: 'BTC/USD',
      candlesticks: { candleSticks: [] }
    };

    const expectedState = {
      list: {
        'BTC/USD': {
          binance: []
        }
      },
      meta: {
        'BTC/USD': {
          binance: {
            loading: false
          }
        }
      }
    };

    expect(candlesticks(initialState, action)).toEqual(expectedState);
  });

  it('removes loading state on failure', () => {
    const action = {
      type: actions.FETCH_CANDLESTICKS_ERROR,
      exchangeName: 'binance',
      symbol: 'BTC/USD',
      error: 'Error test'
    };

    const expectedState = {
      list: {},
      meta: {
        'BTC/USD': {
          binance: {
            loading: false,
            error: 'Error test'
          }
        }
      }
    };

    expect(candlesticks(initialState, action)).toEqual(expectedState);
  });
});
