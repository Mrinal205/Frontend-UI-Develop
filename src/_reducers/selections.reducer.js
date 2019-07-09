import {
  SELECT_TOP_COINS_QUOTE,
  SELECT_TOP_MARKETS_PAGE,
  SELECT_EXCHANGE,
  SELECT_TOP_MARKETS_SORTING,
  SELECT_MARKETS_SORTING
} from '_actions/selections.actions';

const initialState = {
  marketOverview: {
    quote: 'BTC',
    topMarkets: {}
  },
  marketDetails: {
    marketsList: {}
  }
};

const markets = (state = initialState, action) => {
  switch (action.type) {
    case SELECT_TOP_COINS_QUOTE: {
      return {
        ...state,
        marketOverview: {
          ...state.marketOverview,
          quote: action.quote
        }
      };
    }

    case SELECT_TOP_MARKETS_PAGE: {
      return {
        ...state,
        marketOverview: {
          ...state.marketOverview,
          topMarkets: {
            ...state.marketOverview.topMarkets,
            [action.quote]: {
              ...state.marketOverview.topMarkets[action.quote],
              page: action.page
            }
          }
        }
      };
    }

    case SELECT_TOP_MARKETS_SORTING: {
      return {
        ...state,
        marketOverview: {
          ...state.marketOverview,
          topMarkets: {
            ...state.marketOverview.topMarkets,
            [action.quote]: {
              ...state.marketOverview.topMarkets[action.quote],
              sortBy: action.sortBy,
              order: action.order
            }
          }
        }
      };
    }

    case SELECT_EXCHANGE: {
      return {
        ...state,
        marketOverview: {
          ...state.marketOverview,
          topMarkets: {},
          quote: 'BTC'
        }
      };
    }

    case SELECT_MARKETS_SORTING: {
      return {
        ...state,
        marketDetails: {
          ...state.marketDetails,
          marketsList: {
            ...state.marketDetails.marketsList,
            sortBy: action.sortBy,
            order: action.order
          }
        }
      };
    }

    default:
      return state;
  }
};

export default markets;
