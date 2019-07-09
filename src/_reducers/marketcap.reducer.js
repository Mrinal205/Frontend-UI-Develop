import {
  FETCH_MARKETCAP_REQUEST,
  FETCH_MARKETCAP_SUCCESS,
  FETCH_MARKETCAP_ERROR
} from '_actions/marketcap.actions';

const initialState = {
  meta: {}
};

const markets = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_MARKETCAP_REQUEST: {
      return {
        ...state,
        meta: { loading: true }
      };
    }

    case FETCH_MARKETCAP_SUCCESS: {
      return {
        ...action.marketcap,
        meta: {}
      };
    }

    case FETCH_MARKETCAP_ERROR: {
      return {
        ...state,
        meta: {
          error: true,
          errorMessage: action.error.message
        }
      };
    }

    default:
      return state;
  }
};

export default markets;
