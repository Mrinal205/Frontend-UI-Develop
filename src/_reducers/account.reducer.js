import * as actions from '../_actions/account.actions';
import { actionTypes as twoFaActionTypes } from '_actions/twoFactorAuth.actions';

// case functions to simplify reducer
function getAccount(state, action) {
  const accountData = action.account;
  let { personalDetails, address } = accountData;

  // initialize address if its empty
  // TODO: Backend could return already defined object
  if (address === null) {
    address = {};
  }

  return {
    ...accountData,
    // need this to prevent null values
    personalDetails: {
      name: personalDetails.name || '',
      dateOfBirth: personalDetails.dateOfBirth || '',
      phone: personalDetails.phone || ''
    },
    address: {
      line1: address.line1 || '',
      line2: address.line2 || '',
      city: address.city || '',
      postal: address.postal || '',
      province: address.province || '',
      country: address.country || ''
    },
    meta: {
      loaded: true
    }
  };
}

const initialState = {
  personalDetails: {
    name: '',
    dateOfBirth: '',
    phone: ''
  },
  address: {
    line1: '',
    line2: '',
    city: '',
    postal: '',
    province: '',
    country: ''
  },
  meta: {
    loading: true
  }
};

const account = (state = initialState, action) => {
  switch (action.type) {
    case actions.GET_ACCOUNT_REQUEST:
      return {
        ...state,
        meta: {
          loading: true
        }
      };

    case actions.GET_ACCOUNT_SUCCESS:
      return getAccount(state, action);

    case actions.GET_ACCOUNT_ERROR: {
      const { message } = action.error;
      return {
        ...state,
        meta: {
          error: true,
          errorMessage: message
        }
      };
    }

    case actions.UPDATE_ACCOUNT_REQUEST: {
      const accountData = action.account;
      const { personalDetails, address } = accountData;
      return {
        ...state,
        personalDetails: { ...personalDetails },
        address: { ...address },
        meta: {
          updating: true
        }
      };
    }

    // resets account errors / messages
    case actions.UPDATE_ACCOUNT_RESET: {
      return Object.assign({}, state, { meta: { loaded: true } });
    }

    case actions.UPDATE_ACCOUNT_SUCCESS:
      return {
        ...state,
        meta: {
          updated: true
        }
      };

    case actions.UPDATE_ACCOUNT_ERROR: {
      const { message } = action.error;
      return {
        ...state,
        meta: {
          error: true,
          errorMessage: message
        }
      };
    }

    case actions.ADD_EMAIL_SUBSCRIPTION_SUCCESS: {
      return {
        ...state,
        emailSubscriptions: [...state.emailSubscriptions, action.subscription]
      };
    }

    case actions.REMOVE_EMAIL_SUBSCRIPTION_REQUEST: {
      const updatedSubscriptions = state.emailSubscriptions.filter(
        item => item.type !== action.subscription.type
      );

      return {
        ...state,
        emailSubscriptions: updatedSubscriptions
      };
    }

    case twoFaActionTypes.CONFIRM_2FA_SUCCESS: {
      return {
        ...state,
        twoFactorEnabled: true
      };
    }

    case twoFaActionTypes.DISABLE_2FA_SUCCESS: {
      return {
        ...state,
        twoFactorEnabled: false
      };
    }

    default:
      return state;
  }
};

export default account;
