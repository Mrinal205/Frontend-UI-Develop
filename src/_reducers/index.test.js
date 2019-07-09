import rootReducer from './index';
import * as actions from '_actions/user.actions';

describe('root reducer', () => {
  it('returns initial state', () => {
    const initialState = rootReducer(undefined, {});

    expect(initialState.user).toEqual({ meta: {} });
  });

  it('wipes the store on user logout', () => {
    const initialState = {
      account: {
        meta: {
          test: 'foo'
        }
      },
      user: {
        userId: 'some-id',
        email: 'email@example.org',
        meta: {}
      }
    };
    const state = rootReducer(initialState, actions.logoutUserRequest());

    expect(state.user).toEqual({ meta: {} });
    expect(state.account.meta).toEqual({ loading: true });
  });
});
