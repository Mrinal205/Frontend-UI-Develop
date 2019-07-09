import * as actions from './exchanges.actions';

describe('Connect', () => {
  it('creates an action for connect exchange request', () => {
    const expectedAction = {
      type: 'CONNECT_EXCHANGE_REQUEST'
    };

    expect(actions.connectExchangeRequest()).toEqual(expectedAction);
  });

  it('creates an action for connect exchange success', () => {
    const expectedAction = {
      type: 'CONNECT_EXCHANGE_SUCCESS',
      exchange: {
        exchangeName: 'Test',
        id: 'someId'
      }
    };

    expect(actions.connectExchangeSuccess({ exchangeName: 'Test', id: 'someId' })).toEqual(
      expectedAction
    );
  });

  it('creates an action for connect exchange error', () => {
    const mockExchange = {
      exchangeName: 'Test'
    };

    const expectedAction = {
      type: 'CONNECT_EXCHANGE_ERROR',
      exchange: {
        ...mockExchange
      },
      error: {
        message: 'Error message!'
      }
    };

    expect(actions.connectExchangeError(mockExchange, { message: 'Error message!' })).toEqual(
      expectedAction
    );
  });

  it('creates an action-thunk for connect exchange', () => {
    expect(actions.connectExchange()).toBeDefined();
  });
});
