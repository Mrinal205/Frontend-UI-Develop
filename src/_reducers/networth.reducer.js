import {
  FETCH_BALANCE_NETWORTH_REQUEST,
  FETCH_BALANCE_NETWORTH_SUCCESS,
  FETCH_BALANCE_NETWORTH_ERROR,
  FETCH_BASE_NETWORTH_REQUEST,
  FETCH_BASE_NETWORTH_SUCCESS,
  FETCH_BASE_NETWORTH_ERROR
} from '_actions/balance.actions';

const initialState = {
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

const networth = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_BALANCE_NETWORTH_REQUEST:
      return {
        ...state,
        meta: {
          error: false,
          loading: true
        }
      };

    case FETCH_BALANCE_NETWORTH_SUCCESS:
      return {
        ...state,
        ...action.payload,
        meta: {
          ...state.meta,
          loading: false
        }
      };

    case FETCH_BALANCE_NETWORTH_ERROR:
      return {
        ...state,
        meta: {
          error: true,
          loading: false
        }
      };

    case FETCH_BASE_NETWORTH_REQUEST:
      return {
        ...state,
        base: {
          ...state.base,
          meta: {
            error: false,
            loading: true
          }
        }
      };

    case FETCH_BASE_NETWORTH_ERROR:
      return {
        ...state,
        base: {
          ...state.base,
          meta: {
            error: true,
            loading: false
          }
        }
      };

    case FETCH_BASE_NETWORTH_SUCCESS:
      return {
        ...state,
        base: {
          ...state.base,
          ...action.payload,
          meta: {
            ...state.base.meta,
            loading: false
          }
        }
      };

    default:
      return state;
  }
};

export default networth;
