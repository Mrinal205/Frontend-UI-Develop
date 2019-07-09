import TwoFactorAuthService from '_services/twoFactorAuth.service';

export const actionTypes = {
  CREATE_2FA_REQUEST: 'CREATE_2FA_REQUEST',
  CREATE_2FA_SUCCESS: 'CREATE_2FA_SUCCESS',
  CREATE_2FA_ERROR: 'CREATE_2FA_ERROR',
  CONFIRM_2FA_REQUEST: 'CONFIRM_2FA_REQUEST',
  CONFIRM_2FA_SUCCESS: 'CONFIRM_2FA_SUCCESS',
  CONFIRM_2FA_ERROR: 'CONFIRM_2FA_ERROR',
  DISABLE_2FA_REQUEST: 'DISABLE_2FA_REQUEST',
  DISABLE_2FA_SUCCESS: 'DISABLE_2FA_SUCCESS',
  DISABLE_2FA_ERROR: 'DISABLE_2FA_ERROR',
  RESET_2FA: 'RESET_2FA'
};

/**
 * Create 2FA
 */

export function create2faRequest() {
  return {
    type: actionTypes.CREATE_2FA_REQUEST
  };
}

export function create2faSuccess(payload) {
  return {
    type: actionTypes.CREATE_2FA_SUCCESS,
    payload: payload
  };
}

export function create2faError(error) {
  return {
    type: actionTypes.CREATE_2FA_ERROR,
    payload: error
  };
}

export function create2fa(userId) {
  return dispatch => {
    dispatch(create2faRequest());
    return TwoFactorAuthService.create(userId).then(
      data => dispatch(create2faSuccess(data)),
      error => dispatch(create2faError(error))
    );
  };
}

/**
 * Confirm 2FA
 */

export function confirm2faRequest() {
  return {
    type: actionTypes.CONFIRM_2FA_REQUEST
  };
}

export function confirm2faSuccess() {
  return {
    type: actionTypes.CONFIRM_2FA_SUCCESS
  };
}

export function confirm2faError(error) {
  return {
    type: actionTypes.CONFIRM_2FA_ERROR,
    payload: error
  };
}

export function confirm2fa(number, userId) {
  return dispatch => {
    dispatch(confirm2faRequest());
    return TwoFactorAuthService.confirm(number, userId).then(
      data => dispatch(confirm2faSuccess()),
      error => dispatch(confirm2faError(error))
    );
  };
}

/**
 * Disable 2FA
 */

export function disable2faRequest() {
  return {
    type: actionTypes.DISABLE_2FA_REQUEST
  };
}

export function disable2faSuccess() {
  return {
    type: actionTypes.DISABLE_2FA_SUCCESS
  };
}

export function disable2faError(error) {
  return {
    type: actionTypes.DISABLE_2FA_ERROR,
    payload: error
  };
}

export function disable2fa(number, userId) {
  return dispatch => {
    dispatch(disable2faRequest());
    return TwoFactorAuthService.disable(number, userId).then(
      data => dispatch(disable2faSuccess()),
      error => dispatch(disable2faError(error))
    );
  };
}

export function reset2fa() {
  return {
    type: actionTypes.RESET_2FA
  };
}
