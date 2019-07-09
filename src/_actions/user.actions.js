import { UserService } from '../_services/user.service';

export const actionTypes = {
  FORGOT_PASSWORD_USER_REQUEST: 'FORGOT_PASSWORD_USER_REQUEST',
  FORGOT_PASSWORD_USER_SUCCESS: 'FORGOT_PASSWORD_USER_SUCCESS',
  FORGOT_PASSWORD_USER_ERROR: 'FORGOT_PASSWORD_USER_ERROR',
  FORGOT_PASSWORD_USER_RESET: 'FORGOT_PASSWORD_USER_RESET',

  RESET_PASSWORD_USER_REQUEST: 'RESET_PASSWORD_USER_REQUEST',
  RESET_PASSWORD_USER_SUCCESS: 'RESET_PASSWORD_USER_SUCCESS',
  RESET_PASSWORD_USER_ERROR: 'RESET_PASSWORD_USER_ERROR',
  RESET_PASSWORD_USER_RESET: 'RESET_PASSWORD_USER_RESET',

  USER_EDIT_PASSWORD_REQUEST: 'USER_EDIT_PASSWORD_REQUEST',
  USER_EDIT_PASSWORD_SUCCESS: 'USER_EDIT_PASSWORD_SUCCESS',
  USER_EDIT_PASSWORD_ERROR: 'USER_EDIT_PASSWORD_ERROR',
  USER_EDIT_PASSWORD_RESET: 'USER_EDIT_PASSWORD_RESET',

  LOGIN_USER_REQUEST: 'LOGIN_USER_REQUEST',
  LOGIN_USER_SUCCESS: 'LOGIN_USER_SUCCESS',
  LOGIN_USER_ERROR: 'LOGIN_USER_ERROR',
  LOGIN_USER_RESET: 'LOGIN_USER_RESET',

  LOGIN_2FA_USER_DEMAND: 'LOGIN_2FA_USER_DEMAND',
  LOGIN_2FA_USER_REQUEST: 'LOGIN_2FA_USER_REQUEST',
  LOGIN_2FA_USER_SUCCESS: 'LOGIN_2FA_USER_SUCCESS',
  LOGIN_2FA_USER_ERROR: 'LOGIN_2FA_USER_ERROR',

  REGISTER_USER_REQUEST: 'REGISTER_USER_REQUEST',
  REGISTER_USER_SUCCESS: 'REGISTER_USER_SUCCESS',
  REGISTER_USER_ERROR: 'REGISTER_USER_ERROR',
  REGISTER_USER_RESET: 'REGISTER_USER_RESET',

  VERIFY_USER_REQUEST: 'VERIFY_USER_REQUEST',
  VERIFY_USER_SUCCESS: 'VERIFY_USER_SUCCESS',
  VERIFY_USER_ERROR: 'VERIFY_USER_ERROR',

  RESTORE_USER_REQUEST: 'RESTORE_USER_REQUEST',
  RESTORE_USER_SUCCESS: 'RESTORE_USER_SUCCESS',
  RESTORE_USER_ERROR: 'RESTORE_USER_ERROR',

  LOGOUT_USER_REQUEST: 'LOGOUT_USER_REQUEST',
  LOGOUT_USER_SUCCESS: 'LOGOUT_USER_SUCCESS'
};

/*
 * Action creators for forgot password
 */

export function forgotPasswordUserRequest() {
  return {
    type: actionTypes.FORGOT_PASSWORD_USER_REQUEST
  };
}
export function forgotPasswordUserSuccess(user) {
  return {
    type: actionTypes.FORGOT_PASSWORD_USER_SUCCESS,
    user
  };
}
export function forgotPasswordUserError(error) {
  return {
    type: actionTypes.FORGOT_PASSWORD_USER_ERROR,
    error
  };
}
export function forgotPasswordUserReset() {
  return {
    type: actionTypes.FORGOT_PASSWORD_USER_RESET
  };
}
export function forgotPasswordUser(user) {
  return dispatch => {
    dispatch(forgotPasswordUserRequest());
    return UserService.forgotPassword(user)
      .then(user => {
        return UserService.store(user);
      })
      .then(
        user => {
          dispatch(forgotPasswordUserSuccess(user));
          return user;
        },
        error => {
          dispatch(forgotPasswordUserError(error));
          throw error;
        }
      );
  };
}

/*
 * Action creators for edit password
 */

export function userEditPasswordRequest() {
  return {
    type: actionTypes.USER_EDIT_PASSWORD_REQUEST
  };
}
export function userEditPasswordSuccess(user) {
  return {
    type: actionTypes.USER_EDIT_PASSWORD_SUCCESS,
    user
  };
}
export function userEditPasswordError(error) {
  return {
    type: actionTypes.USER_EDIT_PASSWORD_ERROR,
    error
  };
}
export function userEditPasswordReset() {
  return {
    type: actionTypes.USER_EDIT_PASSWORD_RESET
  };
}

export function userEditPassword(user, updates) {
  return dispatch => {
    dispatch(userEditPasswordRequest());
    return UserService.updatePassword(user.userId, updates).then(
      result => {
        dispatch(userEditPasswordSuccess(user));
        return result;
      },
      error => {
        dispatch(userEditPasswordError(error));
      }
    );
  };
}

/*
 * Action creators for reset password
 */

export function resetPasswordUserRequest() {
  return {
    type: actionTypes.RESET_PASSWORD_USER_REQUEST
  };
}
export function resetPasswordUserSuccess(user) {
  return {
    type: actionTypes.RESET_PASSWORD_USER_SUCCESS,
    user
  };
}
export function resetPasswordUserError(error) {
  return {
    type: actionTypes.RESET_PASSWORD_USER_ERROR,
    error
  };
}
export function resetPasswordUserReset() {
  return {
    type: actionTypes.RESET_PASSWORD_USER_RESET
  };
}

export function resetPasswordUser(payload) {
  return dispatch => {
    dispatch(resetPasswordUserRequest());
    return UserService.resetPassword(payload)
      .then(user => {
        return UserService.store(user);
      })
      .then(
        user => {
          dispatch(resetPasswordUserSuccess(user));
          return user;
        },
        error => {
          dispatch(resetPasswordUserError(error));
        }
      );
  };
}

/*
 * Action creators for login
 */

export function loginUserRequest() {
  return {
    type: actionTypes.LOGIN_USER_REQUEST
  };
}
export function loginUserSuccess(user) {
  return {
    type: actionTypes.LOGIN_USER_SUCCESS,
    user
  };
}
export function loginUserError(error) {
  return {
    type: actionTypes.LOGIN_USER_ERROR,
    error
  };
}
export function loginUserReset() {
  return {
    type: actionTypes.LOGIN_USER_RESET
  };
}

export function loginUser(user) {
  return dispatch => {
    dispatch(loginUserRequest());
    return UserService.login(user)
      .then(user => {
        if (user.accountId) {
          // this may need to be revisited
          return UserService.store(user).then(user => {
            return dispatch(loginUserSuccess(user));
          });
        } else {
          return dispatch(login2faUserDemand(user));
        }
      })
      .catch(error => {
        dispatch(loginUserError(error));
      });
  };
}

/*
 * Action creators for 2FA
 */
export function login2faUserDemand(user) {
  return {
    type: actionTypes.LOGIN_2FA_USER_DEMAND,
    user
  };
}
export function login2faUserRequest() {
  return {
    type: actionTypes.LOGIN_2FA_USER_REQUEST
  };
}
export function login2faUserSuccess(user) {
  return loginUserSuccess(user);
}
export function login2faUserError(error) {
  return {
    type: actionTypes.LOGIN_2FA_USER_ERROR,
    error
  };
}
export function login2faUser(user) {
  return dispatch => {
    dispatch(login2faUserRequest());

    return UserService.login2fa(user).then(
      user => dispatch(login2faUserSuccess(user)),
      error => dispatch(login2faUserError(error))
    );
  };
}

/*
 * Action creators for register
 */
export function registerUserRequest() {
  return {
    type: actionTypes.REGISTER_USER_REQUEST
  };
}
export function registerUserSuccess(user) {
  return {
    type: actionTypes.REGISTER_USER_SUCCESS,
    user
  };
}
export function registerUserError(error) {
  return {
    type: actionTypes.REGISTER_USER_ERROR,
    error
  };
}
export function registerUserReset() {
  return {
    type: actionTypes.REGISTER_USER_RESET
  };
}
export function registerUser(user) {
  return dispatch => {
    dispatch(registerUserRequest());
    return UserService.register(user).then(
      result => {
        const data = {
          ...user,
          ...result
        };
        dispatch(registerUserSuccess(data));
        return data;
      },
      error => {
        dispatch(registerUserError(error));
      }
    );
  };
}

/*
 * Action creators for verification
 */
export function verifyUserRequest() {
  return {
    type: actionTypes.VERIFY_USER_REQUEST
  };
}
export function verifyUserSuccess(user) {
  return {
    type: actionTypes.VERIFY_USER_SUCCESS,
    user
  };
}
export function verifyUserError(error) {
  return {
    type: actionTypes.VERIFY_USER_ERROR,
    error
  };
}
export function verifyUser(user) {
  return dispatch => {
    // First dispatch: the app state is updated to inform that the API call is starting.
    dispatch(verifyUserRequest());

    // The function called by the thunk middleware can return a value,
    // that is passed on as the return value of the dispatch method.
    return UserService.verify(user)
      .then(user => UserService.store(user))
      .then(
        user => {
          dispatch(verifyUserSuccess(user));
          return user;
        },
        error => {
          dispatch(verifyUserError(error));
          throw error;
        }
      );
  };
}

/*
 * Action creators for restore
 */
export function restoreUserRequest() {
  return {
    type: actionTypes.RESTORE_USER_REQUEST
  };
}
export function restoreUserSuccess(user) {
  return {
    type: actionTypes.RESTORE_USER_SUCCESS,
    user
  };
}
export function restoreUserError(error) {
  return {
    type: actionTypes.RESTORE_USER_ERROR,
    error
  };
}
export function restoreUser() {
  return dispatch => {
    dispatch(restoreUserRequest());
    const user = UserService.restore();
    if (user) {
      dispatch(restoreUserSuccess(user));
    } else {
      dispatch(restoreUserError({ error: true, errorMessage: 'Cannot restore user' }));
    }
  };
}

/*
 * Action creators for logout
 */
export function logoutUserRequest() {
  return {
    type: actionTypes.LOGOUT_USER_REQUEST
  };
}

export function logoutUserSuccess() {
  return {
    type: actionTypes.LOGOUT_USER_SUCCESS
  };
}
export function logoutUser() {
  return dispatch => {
    dispatch(logoutUserRequest());
    Promise.all([UserService.apiLogout(), UserService.appLogout()])
      .then(() => dispatch(logoutUserSuccess()))
      .catch(() => dispatch(logoutUserSuccess()));
  };
}
