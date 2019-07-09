import twoFactorAuth from './twoFactorAuth.reducer';
import * as actions from '../_actions/twoFactorAuth.actions';

describe('twoFactorAuth reducer', () => {
  it('returns initial state', () => {
    const expectedState = { meta: {} };

    expect(twoFactorAuth(undefined, {})).toEqual(expectedState);
  });

  it('returns correct state for CREATE_2FA_REQUEST action', () => {
    const expectedState = { meta: { creating: true } };

    expect(twoFactorAuth({}, actions.create2faRequest())).toEqual(expectedState);
  });

  it('returns correct state for CREATE_2FA_SUCCESS action', () => {
    const uri = 'otpauth://totp/MoonAssist...';
    const initialState = { meta: { creating: true } };
    const expectedState = { uri, meta: { created: true } };

    expect(twoFactorAuth(initialState, actions.create2faSuccess(uri))).toEqual(expectedState);
  });

  it('returns correct state for CREATE_2FA_ERROR action', () => {
    const initialState = { meta: { creating: true } };
    const errorMessage = 'Test error message!';
    const expectedState = {
      meta: {
        error: true,
        errorMessage
      }
    };

    expect(twoFactorAuth(initialState, actions.create2faError(errorMessage))).toEqual(
      expectedState
    );
  });
});
