import { actionTypes } from '_actions/user.actions';

const initialState = {
  meta: {}
};

const user = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.LOGIN_USER_REQUEST:
    case actionTypes.LOGIN_2FA_USER_REQUEST:
    case actionTypes.REGISTER_USER_REQUEST:
    case actionTypes.VERIFY_USER_REQUEST:
    case actionTypes.FORGOT_PASSWORD_USER_REQUEST:
    case actionTypes.USER_EDIT_PASSWORD_REQUEST:
      return {
        ...state,
        meta: {
          loading: true
        }
      };

    case actionTypes.LOGIN_USER_SUCCESS:
    case actionTypes.REGISTER_USER_SUCCESS:
    case actionTypes.RESTORE_USER_SUCCESS:
    case actionTypes.VERIFY_USER_SUCCESS:
    case actionTypes.FORGOT_PASSWORD_USER_SUCCESS: {
      const { user } = action;
      return {
        ...user,
        meta: {}
      };
    }

    case actionTypes.USER_EDIT_PASSWORD_SUCCESS: {
      const { user } = action;
      return {
        ...user,
        meta: {
          updated: true
        }
      };
    }

    case actionTypes.LOGIN_USER_ERROR:
    case actionTypes.REGISTER_USER_ERROR:
    case actionTypes.VERIFY_USER_ERROR:
    case actionTypes.FORGOT_PASSWORD_USER_ERROR:
    case actionTypes.RESET_PASSWORD_USER_ERROR: {
      const { message } = action.error;
      return {
        meta: {
          error: true,
          errorMessage: message
        }
      };
    }
    case actionTypes.USER_EDIT_PASSWORD_ERROR: {
      const { message } = action.error;
      return {
        ...state,
        meta: {
          error: true,
          errorMessage: message
        }
      };
    }

    case actionTypes.LOGIN_2FA_USER_ERROR: {
      const { message } = action.error;
      return {
        ...state,
        twoFactorAuthRequired: true,
        meta: {
          error: true,
          errorMessage: message
        }
      };
    }

    case actionTypes.LOGIN_USER_RESET:
    case actionTypes.REGISTER_USER_RESET:
    case actionTypes.USER_EDIT_PASSWORD_RESET:
      return {
        ...state,
        meta: {}
      };

    case actionTypes.LOGIN_2FA_USER_DEMAND: {
      const { user } = action;
      return {
        ...user,
        twoFactorAuthRequired: true,
        meta: {}
      };
    }

    default:
      return state;
  }
};

export default user;
