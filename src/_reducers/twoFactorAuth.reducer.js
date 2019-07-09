import { actionTypes } from '../_actions/twoFactorAuth.actions';

const initialState = { meta: {} };

const twoFactorAuth = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.CREATE_2FA_REQUEST:
      return {
        meta: {
          creating: true
        }
      };
    case actionTypes.CREATE_2FA_SUCCESS:
      return {
        uri: action.payload,
        meta: {
          created: true
        }
      };
    case actionTypes.CREATE_2FA_ERROR:
      return {
        meta: {
          error: true,
          errorMessage: action.payload
        }
      };
    case actionTypes.CONFIRM_2FA_REQUEST:
      return {
        ...state,
        meta: {
          confirming: true
        }
      };
    case actionTypes.CONFIRM_2FA_SUCCESS:
      return {
        meta: {
          confirmed: true
        }
      };
    case actionTypes.CONFIRM_2FA_ERROR:
      return {
        ...state,
        meta: {
          error: true,
          errorMessage: action.payload.message
        }
      };
    case actionTypes.DISABLE_2FA_REQUEST: {
      return {
        ...state,
        meta: {
          disabling: true
        }
      };
    }
    case actionTypes.DISABLE_2FA_ERROR:
      return {
        ...state,
        meta: {
          error: true,
          errorMessage: action.payload.message
        }
      };

    case actionTypes.DISABLE_2FA_SUCCESS:
      return {
        ...state,
        meta: {
          disabled: true
        }
      };

    case actionTypes.RESET_2FA:
    default:
      return {
        ...state,
        meta: {}
      };
  }
};

export default twoFactorAuth;
