import * as accountActions from './account.actions';

describe('Get', () => {
  it('should create action for get account request', () => {
    const expectedAction = {
      type: 'GET_ACCOUNT_REQUEST'
    };

    expect(accountActions.getAccountRequest()).toEqual(expectedAction);
  });

  it('should create action for get account success', () => {
    const expectedAction = {
      type: 'GET_ACCOUNT_SUCCESS',
      account: {
        id: 'test-1234'
      }
    };

    expect(accountActions.getAccountSuccess({ id: 'test-1234' })).toEqual(expectedAction);
  });

  it('should create action for get account error', () => {
    const expectedAction = {
      type: 'GET_ACCOUNT_ERROR',
      error: 'Test error!'
    };

    expect(accountActions.getAccountError('Test error!')).toEqual(expectedAction);
  });

  it('should create action-thunk for get account', () => {
    expect(accountActions.getAccount('some-id')).toBeDefined();
  });
});

describe('Update', () => {
  it('creates an action for update account request', () => {
    const expectedAction = {
      type: 'UPDATE_ACCOUNT_REQUEST',
      account: {
        address: {
          line1: 'test 1'
        }
      }
    };

    expect(accountActions.updateAccountRequest({ address: { line1: 'test 1' } })).toEqual(
      expectedAction
    );
  });

  it('creates an action for update account success', () => {
    const expectedAction = {
      type: 'UPDATE_ACCOUNT_SUCCESS'
    };

    expect(accountActions.updateAccountSuccess({ id: 'test-1234' })).toEqual(expectedAction);
  });

  it('creates an action for update account error', () => {
    const expectAction = {
      type: 'UPDATE_ACCOUNT_ERROR',
      error: 'Update error!'
    };

    expect(accountActions.updateAccountError('Update error!')).toEqual(expectAction);
  });

  it('creates an action-thunk for update account', () => {
    expect(accountActions.updateAccount({})).toBeDefined();
  });
});
