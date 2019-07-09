import { actionTypes } from './user.actions';
import * as userActions from './user.actions';

describe('Register', () => {
  it('should create an action for register user reset', () => {
    const expectedAction = {
      type: actionTypes.REGISTER_USER_RESET
    };

    expect(userActions.registerUserReset()).toEqual(expectedAction);
  });

  it('should create an action to register request', () => {
    const expectedAction = {
      type: actionTypes.REGISTER_USER_REQUEST
    };

    expect(userActions.registerUserRequest()).toEqual(expectedAction);
  });

  it('should create an action for register request success', () => {
    const user = {};
    const expectedAction = {
      type: actionTypes.REGISTER_USER_SUCCESS,
      user
    };

    expect(userActions.registerUserSuccess(user)).toEqual(expectedAction);
  });

  it('should create an action for register request error', () => {
    const error = 'Error message!';
    const expectedAction = {
      type: actionTypes.REGISTER_USER_ERROR,
      error
    };

    expect(userActions.registerUserError(error)).toEqual(expectedAction);
  });

  it('should create action-thunk for register user', () => {
    expect(userActions.registerUser()).toBeDefined();
  });
});

describe('Login', () => {
  it('should create an action for login user reset', () => {
    const expectedAction = {
      type: actionTypes.LOGIN_USER_RESET
    };

    expect(userActions.loginUserReset()).toEqual(expectedAction);
  });

  it('should create an action for login user request', () => {
    const expectedAction = {
      type: actionTypes.LOGIN_USER_REQUEST
    };

    expect(userActions.loginUserRequest()).toEqual(expectedAction);
  });

  it('should create an action for login user success', () => {
    const user = {};
    const expectedAction = {
      type: actionTypes.LOGIN_USER_SUCCESS,
      user
    };

    expect(userActions.loginUserSuccess(user)).toEqual(expectedAction);
  });

  it('should create an action for login user error', () => {
    const error = 'Error message!';
    const expectedAction = {
      type: actionTypes.LOGIN_USER_ERROR,
      error
    };

    expect(userActions.loginUserError(error)).toEqual(expectedAction);
  });

  it('should create action-thunk for login user', () => {
    expect(userActions.loginUser()).toBeDefined();
  });

  it('creates an action for 2FA login user success', () => {
    const user = {};
    const expectedAction = {
      type: actionTypes.LOGIN_USER_SUCCESS,
      user
    };
  });
});

describe('Restore', () => {
  it('should create an action for restore user request', () => {
    const expectedAction = {
      type: actionTypes.RESTORE_USER_REQUEST
    };

    expect(userActions.restoreUserRequest()).toEqual(expectedAction);
  });

  it('should create an action for restore user success', () => {
    const user = {};
    const expectedAction = {
      type: actionTypes.RESTORE_USER_SUCCESS,
      user
    };

    expect(userActions.restoreUserSuccess(user)).toEqual(expectedAction);
  });

  it('should create an action for restore user error', () => {
    const expectedAction = {
      type: actionTypes.RESTORE_USER_ERROR
    };

    expect(userActions.restoreUserError()).toEqual(expectedAction);
  });

  it('should create action-thunk for restoring user', () => {
    expect(userActions.restoreUser()).toBeDefined();
  });
});

describe('Logout', () => {
  it('should create an action for logout user success', () => {
    const expectedAction = {
      type: actionTypes.LOGOUT_USER_SUCCESS
    };

    expect(userActions.logoutUserSuccess()).toEqual(expectedAction);
  });

  it('should create action-thunk for logout user', () => {
    expect(userActions.logoutUser()).toBeDefined();
  });
});

describe('Verify', () => {
  it('creates an action to verify request', () => {
    const expectedAction = {
      type: actionTypes.VERIFY_USER_REQUEST
    };

    expect(userActions.verifyUserRequest()).toEqual(expectedAction);
  });

  it('creates an action for verify request success', () => {
    const user = {};
    const expectedAction = {
      type: actionTypes.VERIFY_USER_SUCCESS,
      user
    };

    expect(userActions.verifyUserSuccess(user)).toEqual(expectedAction);
  });

  it('creates an action for verify request error', () => {
    const error = 'Error message!';
    const expectedAction = {
      type: actionTypes.VERIFY_USER_ERROR,
      error
    };

    expect(userActions.verifyUserError(error)).toEqual(expectedAction);
  });

  it('creates action-thunk for verify user', () => {
    expect(userActions.verifyUser()).toBeDefined();
  });
});
