import selections from './selections.reducer';
import * as actions from '../_actions/selections.actions';

describe('selections reducer', () => {
  const InitialState = {
    marketOverview: {
      quote: 'BTC',
      topMarkets: {}
    },
    marketDetails: {
      marketsList: {}
    }
  };

  it('returns initial state', () => {
    expect(selections(undefined, {})).toEqual(InitialState);
  });

  it('returns unmodified state for not relevant actions', () => {
    expect(selections(InitialState, { type: '@moon/DUMMY_ACTION' })).toEqual(InitialState);
  });

  it('sets top coins quote', () => {
    const expectedState = {
      ...InitialState,
      marketOverview: {
        ...InitialState.marketOverview,
        quote: 'usd'
      }
    };
    expect(selections(InitialState, actions.selectTopCoinsQuote('usd'))).toEqual(expectedState);
  });

  it('sets top markets page for a currency', () => {
    const expectedState = {
      ...InitialState,
      marketOverview: {
        ...InitialState.marketOverview,
        topMarkets: { btc: { page: 1 } }
      }
    };
    expect(selections(InitialState, actions.selectTopMarketsPage('btc', 1))).toEqual(expectedState);
  });

  it('sets top markets sorting for a currency', () => {
    const expectedState = {
      ...InitialState,
      marketOverview: {
        ...InitialState.marketOverview,
        topMarkets: { btc: { order: 'desc', sortBy: 'price' } }
      }
    };
    expect(
      selections(
        InitialState,
        actions.selectTopMarketsSorting({
          quote: 'btc',
          sortBy: 'price',
          order: 'desc'
        })
      )
    ).toEqual(expectedState);
  });

  it('sets top markets page for a currency', () => {
    const modifiedState = {
      ...InitialState,
      marketOverview: {
        ...InitialState.marketOverview,
        topMarkets: {},
        quote: 'BTC'
      }
    };
    expect(selections(modifiedState, actions.selectExchange())).toEqual(InitialState);
  });

  it('sets markets lists sorting', () => {
    const expectedState = {
      ...InitialState,
      marketDetails: {
        ...InitialState.marketDetails,
        marketsList: {
          order: 'ASC',
          sortBy: 'volume'
        }
      }
    };

    expect(
      selections(
        InitialState,
        actions.selectMarketsSorting({
          sortBy: 'volume',
          order: 'ASC'
        })
      )
    ).toEqual(expectedState);
  });
});
