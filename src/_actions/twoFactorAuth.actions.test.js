import * as actions from './twoFactorAuth.actions';

describe('create', () => {
  it('creates an action for create 2fa request', () => {
    const expectedAction = {
      type: 'CREATE_2FA_REQUEST'
    };

    expect(actions.create2faRequest()).toEqual(expectedAction);
  });

  it('creates an action for create 2fa success', () => {
    const uri = 'otpauth://totp/MoonAssist...';
    const expectedAction = {
      type: 'CREATE_2FA_SUCCESS',
      payload: uri
    };

    expect(actions.create2faSuccess(uri)).toEqual(expectedAction);
  });

  it('creates and action for create 2fa error', () => {
    const error = 'Test error!';

    const expectedAction = {
      type: 'CREATE_2FA_ERROR',
      payload: error
    };

    expect(actions.create2faError(error)).toEqual(expectedAction);
  });

  it('creates action-thunk for create 2fa', () => {
    expect(actions.create2fa('someid')).toBeDefined();
  });
});

describe('confirm', () => {
  it('creates an action for confirm 2fa request', () => {
    const expectedAction = {
      type: 'CONFIRM_2FA_REQUEST'
    };

    expect(actions.confirm2faRequest()).toEqual(expectedAction);
  });

  it('creates an action for confirm 2fa success', () => {
    const expectedAction = {
      type: 'CONFIRM_2FA_SUCCESS'
    };

    expect(actions.confirm2faSuccess()).toEqual(expectedAction);
  });

  it('creates and action for confirm 2fa error', () => {
    const error = 'Test error!';

    const expectedAction = {
      type: 'CONFIRM_2FA_ERROR',
      payload: error
    };

    expect(actions.confirm2faError(error)).toEqual(expectedAction);
  });

  it('creates action-thunk for confirm 2fa', () => {
    expect(actions.confirm2fa('123456', 'someid')).toBeDefined();
  });
});

describe('disable', () => {
  it('creates an action for disabling 2fa request', () => {
    const expectedAction = {
      type: 'DISABLE_2FA_REQUEST'
    };

    expect(actions.disable2faRequest()).toEqual(expectedAction);
  });

  it('creates an action for disabling 2fa success', () => {
    const expectedAction = {
      type: 'DISABLE_2FA_SUCCESS'
    };

    expect(actions.disable2faSuccess()).toEqual(expectedAction);
  });

  it('creates and action for disabling 2fa error', () => {
    const error = 'Test error!';

    const expectedAction = {
      type: 'DISABLE_2FA_ERROR',
      payload: error
    };

    expect(actions.disable2faError(error)).toEqual(expectedAction);
  });

  it('creates action-thunk for disable 2fa', () => {
    expect(actions.disable2fa('someid')).toBeDefined();
  });
});
