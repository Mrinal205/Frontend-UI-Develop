import account from './account.reducer';
import * as actions from '../_actions/account.actions';
import { restoreUser } from '../_actions/user.actions';

describe('account reducer', () => {
  it('returns initial state', () => {
    const expectedState = {
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
    expect(account(undefined, {})).toEqual(expectedState);
  });

  it('returns loading state for GET_ACCOUNT_REQUEST action', () => {
    const initialState = {
      personalDetails: {
        name: 'Test name'
      },
      meta: {}
    };

    const expectedState = {
      personalDetails: {
        name: 'Test name'
      },
      meta: {
        loading: true
      }
    };

    expect(account(initialState, actions.getAccountRequest())).toEqual(expectedState);
  });

  it('returns account state for GET_ACCOUNT_SUCCESS action', () => {
    const personalDetails = {
      name: 'John Doe',
      dateOfBirth: '2000-01-01',
      phone: '+44 1234 12345'
    };

    const address = {
      line1: 'Lorem Ipsum',
      line2: 'Street 2',
      city: 'London',
      postal: 'W0 XXX',
      province: 'London',
      country: 'United Kingdom'
    };

    const responseAccount = {
      id: 'test-id',
      personalDetails: {
        ...personalDetails
      },
      address: {
        ...address
      }
    };

    const expectedState = {
      id: 'test-id',
      personalDetails,
      address,
      meta: {
        loaded: true
      }
    };

    expect(account(undefined, actions.getAccountSuccess(responseAccount))).toEqual(expectedState);
  });

  it('returns account state for GET_ACCOUNT_ERROR action', () => {
    const expectedState = {
      personalDetails: {},
      address: {},
      meta: {
        error: true,
        errorMessage: 'Example error message!'
      }
    };

    const initialState = {
      personalDetails: {},
      address: {},
      meta: { loading: true }
    };
    const responseData = { message: 'Example error message!' };

    expect(account(initialState, actions.getAccountError(responseData))).toEqual(expectedState);
  });

  it('returns correct account state for UPDATE_ACCOUNT_RESET action', () => {
    const initialState = {
      name: 'foo',
      meta: { error: true }
    };

    const expectedState = {
      name: 'foo',
      meta: {
        loaded: true
      }
    };

    expect(account(initialState, actions.updateAccountReset())).toEqual(expectedState);
  });

  describe('email notifications', () => {
    it('returns correct state for ADD_EMAIL_SUBSCRIPTION_SUCCESS', () => {
      const state = {
        name: 'foo',
        emailSubscriptions: []
      };

      const expectedState = {
        name: 'foo',
        emailSubscriptions: [{ type: 'LOGIN', id: '1234' }]
      };

      const response = { type: 'LOGIN', id: '1234' };

      expect(account(state, actions.addEmailSubscriptionSuccess(response))).toEqual(expectedState);
    });

    it('returns correct state for REMOVE_EMAIL_SUBSCRIPTION_REQUEST', () => {
      const state = {
        name: 'foo',
        emailSubscriptions: [{ type: 'LOGIN', id: '1234' }, { type: 'NEWSLETTER', id: '4567' }]
      };

      const expectedState = {
        name: 'foo',
        emailSubscriptions: [{ type: 'NEWSLETTER', id: '4567' }]
      };

      const toRemove = { type: 'LOGIN', id: '1234' };

      expect(account(state, actions.removeEmailSubscriptionRequest(toRemove))).toEqual(
        expectedState
      );
    });
  });
});
