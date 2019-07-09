import user from './user.reducer';
import * as userActions from '_actions/user.actions';

describe('user reducer', () => {
  it('returns initial state', () => {
    const expectedState = { meta: {} };
    expect(user(undefined, {})).toEqual(expectedState);
  });

  describe('Login', () => {
    it('handles LOGIN_USER_RESET action', () => {
      const prevState = {
        meta: { error: true, errorMessage: 'Test error message!' }
      };
      expect(user(prevState, userActions.loginUserReset())).toEqual({
        meta: {}
      });
    });

    it('handles LOGIN_USER_SUCCESS action', () => {
      const response = {
        accountId: 'accountId',
        email: 'foo@example.com',
        token: 'userToken', // TODO: API Still returns it, but app doesn't depend on it
        userId: 'accountUserId'
      };

      const expectedState = {
        ...response,
        meta: {}
      };

      const newUserState = user(undefined, userActions.loginUserSuccess(response));

      expect(newUserState).toEqual(expectedState);
    });
  });

  describe('Register', () => {
    it('handles REGISTER_USER_RESET action', () => {
      const newUserState = user({ meta: { error: true } }, userActions.registerUserReset());
      expect(newUserState).toEqual({ meta: {} });
    });
  });

  describe('Verify', () => {
    it('handles VERIFY_USER_REQUEST action', () => {
      const prevState = {
        meta: {}
      };

      const expectedState = {
        meta: {
          loading: true
        }
      };

      expect(user(prevState, userActions.verifyUserRequest())).toEqual(expectedState);
    });

    it('handles VERIFY_USER_SUCCESS action', () => {
      const prevState = {
        meta: { loading: true }
      };

      const responseUser = {
        userId: 'someId',
        token: 'userToken'
      };

      const expectedState = {
        ...responseUser,
        meta: {}
      };

      expect(user(prevState, userActions.verifyUserSuccess(responseUser))).toEqual(expectedState);
    });
  });
});
