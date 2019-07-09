import { rpcIds, actionNames } from '_actions/ids';
import {
  createRPCAction,
  createRPCReducer,
  createPeriodicalRPCAction,
  stopPeriodicalRPCAction
} from './rpc';
import { noop } from 'lodash';

describe('stopPeriodicalRPCAction', () => {
  it('should return a stop action', () => {
    expect(stopPeriodicalRPCAction(rpcIds.fetchBalance).type).toEqual(
      actionNames[rpcIds.fetchBalance].stop
    );
  });
});

describe('createRPCAction', () => {
  it('should create an RPC action', () => {
    const dispatch = jest.fn();
    const apiFn = jest.fn();
    apiFn.mockReturnValue(Promise.resolve('test'));
    const actionCreator = createRPCAction(rpcIds.fetchBalance, apiFn, { testParam: true });

    const expectedRequestAction = {
      type: '@moon-rpc/FETCH_BALANCE_REQUEST',
      payload: { testParam: true }
    };

    const expectedAction = {
      type: '@moon-rpc/FETCH_BALANCE_SUCCESS',
      payload: { testParam: true, resp: 'test' }
    };

    actionCreator(dispatch).then(finalAction => {
      expect(dispatch.mock.calls.length).toEqual(2);
      expect(apiFn.mock.calls.length).toEqual(1);
      expect(dispatch.mock.calls[0]).toEqual([expectedRequestAction]);
      expect(dispatch.mock.calls[1]).toEqual([expectedAction]);
      expect(finalAction).toEqual(expectedAction);
    });
  });

  it('should create an RPC action that fails and rejects the promise', () => {
    const dispatch = jest.fn();
    const apiFn = jest.fn();
    apiFn.mockReturnValue(Promise.reject('error'));
    const actionCreator = createRPCAction(rpcIds.fetchBalance, apiFn, { testParam: true });

    const expectedRequestAction = {
      type: '@moon-rpc/FETCH_BALANCE_REQUEST',
      payload: { testParam: true }
    };

    const expectedAction = {
      type: '@moon-rpc/FETCH_BALANCE_FAILURE',
      payload: { testParam: true, error: 'error' }
    };

    actionCreator(dispatch)
      .then(finalAction => {
        expect(dispatch.mock.calls.length).toEqual(2);
        expect(apiFn.mock.calls.length).toEqual(1);
        expect(dispatch.mock.calls[0]).toEqual([expectedRequestAction]);
        expect(dispatch.mock.calls[1]).toEqual([expectedAction]);
        expect(finalAction).toEqual(expectedAction);
      })
      .catch(e => {
        expect(e).toBeDefined();
      });
  });
});

describe('createRPCReducer', () => {
  it('should throw if unsupported key is passed', () => {
    expect(() => {
      createRPCReducer(rpcIds.fetchBalance, { noKey: noop });
    }).toThrow();
  });

  it('should return a function if keys are correct', () => {
    expect(typeof createRPCReducer({ success: noop })).toEqual('function');
  });
});
