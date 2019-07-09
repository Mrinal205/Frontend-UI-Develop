import {
  FETCH_ORDERBOOK_REQUEST,
  FETCH_ORDERBOOK_SUCCESS,
  FETCH_ORDERBOOK_ERROR,
  SELECT_ORDERBOOK_PAGE,
  SELECT_ORDERBOOK_PRECISION
} from '_actions/orderbook.actions';

import { RECEIVE_MARKET_ORDERBOOK_DATA } from '_actions/markets.actions';

const initialState = {
  asks: [],
  bids: [],
  page: {},
  precision: {
    amount: 8,
    base: 8,
    price: 8,
    quote: 8
  },
  meta: {
    loading: true
  }
};

function updateOrderbookItem(list, update, listType) {
  // TODO: apply binary search
  // if found in the list, replace item in list with new one
  for (let i = 0; i < list.length; i++) {
    if (list[i][0] === update[0]) {
      // if volume was 0, remove from the list
      if (update[1] === 0) {
        list.splice(i, 1);
        return list;
      }

      // otherwise replace
      list[i] = update;
      return list;
    }
    if (list[i][0] < update[0]) {
      if (update[1] > 0) {
        list.splice(i, 0, update);
      }
      return list;
    }
  }

  // if not found, just push at last position and return sorted
  if (update[1] > 0) {
    list.push(update);
  }

  return list;
}

/**
 * Iterates over array of orderbook (list or asks) and updates an element if found
 * @param {Object} oldState
 * @param {Array} updates
 */
function updateOrderbookState(oldState, updates) {
  if (!updates || !updates.length) {
    return oldState;
  }

  const state = {
    ...oldState
  };

  // process each item
  updates.forEach(item => {
    if (item.bid) {
      state.bids = updateOrderbookItem(state.bids.slice(), [item.bid, item.amount], 'bids');
    } else {
      state.asks = updateOrderbookItem(state.asks.slice(), [item.ask, item.amount], 'asks');
    }
  });

  return state;
}

const orderbook = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_ORDERBOOK_REQUEST: {
      return {
        ...state,
        asks: [],
        bids: [],
        meta: { loading: true }
      };
    }

    case FETCH_ORDERBOOK_SUCCESS: {
      return {
        ...state,
        asks: [...action.payload.orderbook.asks.reverse()],
        bids: [...action.payload.orderbook.bids],
        page: {},
        meta: {}
      };
    }

    case RECEIVE_MARKET_ORDERBOOK_DATA: {
      const items = action.payload.orderbookData;
      const newState = updateOrderbookState(state, items);
      return newState;
    }

    case FETCH_ORDERBOOK_ERROR: {
      return {
        ...initialState,
        meta: {
          error: true,
          errorMessage: action.payload.error.message
        }
      };
    }

    case SELECT_ORDERBOOK_PAGE: {
      return {
        ...state,
        page: {
          ...state.page,
          [action.payload.area]: action.payload.page
        }
      };
    }

    case SELECT_ORDERBOOK_PRECISION: {
      return {
        ...state,
        precision: action.payload.precision
      };
    }

    default:
      return state;
  }
};

export default orderbook;
