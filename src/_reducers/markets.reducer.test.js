import markets from './markets.reducer';
import * as actions from '../_actions/markets.actions';
import * as actionsMarketInfo from '../_actions/marketInfo.actions';

describe('markets reducer', () => {
  it('returns initial state', () => {
    const expectedInitialState = {};
    expect(markets(undefined, {})).toEqual(expectedInitialState);
  });

  it('returns unmodified state for not relevant actions', () => {
    const state = {};

    expect(markets(state, { type: '@moon/DUMMY_ACTION' })).toEqual(state);
  });

  it('sets meta loading state', () => {
    const initialState = {};

    const expectedState = {
      ...initialState,
      BINANCE: {
        list: {},
        meta: { loading: true }
      }
    };

    expect(markets(initialState, actions.fetchMarketsRequest('BINANCE'))).toEqual(expectedState);
  });

  it('stores list of markets', () => {
    const initialState = {
      BINANCE: {
        list: {},
        meta: {
          loading: true
        }
      }
    };

    const payload = {
      market: {
        'BTC/USD': {},
        'ETH/USD': {}
      }
    };

    const expectedState = {
      list: {
        ...payload.market
      }
    };

    const results = markets(initialState, actions.fetchMarketsSuccess(payload, 'BINANCE'));
    expect(results.BINANCE).toBeDefined();

    const { meta, ...other } = results.BINANCE;
    expect(other).toEqual(expectedState);

    // meta timestamp will take the current timestamp, so we need to test it by type
    expect(Object.keys(meta).length).toEqual(1);
    expect(typeof meta.timestamp).toEqual('object');
  });

  it('sets meta error state', () => {
    const initialState = {
      BINANCE: {
        list: {},
        meta: { loading: true }
      }
    };

    const expectedState = {
      ...initialState,
      BINANCE: {
        list: {},
        meta: {
          error: true,
          errorMessage: 'Error message'
        }
      }
    };

    const errorPayload = {
      message: 'Error message'
    };

    expect(markets(initialState, actions.fetchMarketsError(errorPayload, 'BINANCE'))).toEqual(
      expectedState
    );
  });

  it('stores ticker update for market', () => {
    const initialState = {
      BINANCE: {
        list: {
          'BTC/USD': {},
          'ETH/USD': {}
        },
        meta: {}
      }
    };

    const payload = {
      symbol: 'BTC/USD',
      price: '9000'
    };

    const expectedState = {
      BINANCE: {
        list: {
          'BTC/USD': {
            ...payload
          },
          'ETH/USD': {}
        },
        meta: {}
      }
    };

    expect(markets(initialState, actions.receiveMarketTickerData(payload, 'BINANCE'))).toEqual(
      expectedState
    );
  });

  it('Prepares state for market info', () => {
    const initialState = {
      BINANCE: {
        list: {},
        meta: {}
      }
    };
    const payload = {};

    const expectedState = {
      BINANCE: {
        list: {},
        meta: {},
        symbol: payload
      }
    };

    expect(
      markets(initialState, actionsMarketInfo.fetchMarketRequest('BINANCE', 'symbol'))
    ).toEqual(expectedState);
  });

  it('Stores market info for given coin and exchange', () => {
    const initialState = {
      BINANCE: {
        list: {},
        meta: {},
        symbol: {}
      }
    };
    const payload = { limits: {} };

    const expectedState = {
      BINANCE: {
        list: {},
        meta: {},
        symbol: payload
      }
    };

    expect(
      markets(initialState, actionsMarketInfo.fetchMarketSuccess(payload, 'BINANCE', 'symbol'))
    ).toEqual(expectedState);
  });

  it('Sets error to the given symbol and exchange ', () => {
    const initialState = {
      BINANCE: {
        list: {},
        meta: {},
        symbol: {}
      }
    };
    const payload = { message: 'error message' };

    const expectedState = {
      BINANCE: {
        list: {},
        meta: {},
        symbol: {
          error: true,
          errorMessage: payload.message
        }
      }
    };

    expect(
      markets(initialState, actionsMarketInfo.fetchMarketError(payload, 'BINANCE', 'symbol'))
    ).toEqual(expectedState);
  });
});
