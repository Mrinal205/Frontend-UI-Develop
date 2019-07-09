import {
  FETCH_CANDLESTICKS_REQUEST,
  FETCH_CANDLESTICKS_SUCCESS,
  FETCH_CANDLESTICKS_ERROR
} from '_actions/candlesticks.actions';

const initialState = {
  list: {},
  meta: {}
};

export function normalizeCandlesticks(candleSticks) {
  return candleSticks.filter(item => {
    return item[1] !== null || item[2] !== null || item[3] !== null || item[4] !== null;
  });
}

const candlesticks = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_CANDLESTICKS_REQUEST: {
      const { exchangeName, symbol } = action;
      return {
        ...state,
        meta: {
          ...state.meta,
          [symbol]: {
            ...state.meta[symbol],
            [exchangeName]: {
              loading: true
            }
          }
        }
      };
    }

    case FETCH_CANDLESTICKS_SUCCESS: {
      const {
        exchangeName,
        symbol,
        candlesticks: { candleSticks }
      } = action;
      return {
        ...state,
        list: {
          ...state.list,
          [symbol]: {
            ...state.list[symbol],
            [exchangeName]: normalizeCandlesticks(candleSticks)
          }
        },
        meta: {
          ...state.meta,
          [symbol]: {
            ...state.meta[symbol],
            [exchangeName]: {
              loading: false
            }
          }
        }
      };
    }

    case FETCH_CANDLESTICKS_ERROR: {
      const { exchangeName, symbol } = action;
      return {
        ...state,
        meta: {
          ...state.meta,
          [symbol]: {
            ...state.meta[symbol],
            [exchangeName]: {
              loading: false,
              error: action.error
            }
          }
        }
      };
    }

    default:
      return state;
  }
};

export default candlesticks;
