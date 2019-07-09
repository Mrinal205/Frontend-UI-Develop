import { actionNames } from '_actions/ids';
import { createAction } from 'redux-actions';
import { DefaultIntervalMs } from '_constants/timeouts';

// We'll store current timeouts here
const RPCTimeouts = {};

/* Creates a periodical RPC action that will be called again after an interval
 * @param {string} rpcId
 * @param {function} apiFn: async function to be executed, must return a promise
 * @param {object} params to be passed to apiFn
 * @param {function/number/boolean} interval - optional defaults to DefaultTimeoutMs
 *    ^ if number that will be the number of millisecods before the next call
 *    ^ if function, that function will be called with (action, dispacth, getState) as params and a number will be expected
 *    ^ if false, no new RPCaction will be triggered
 * @return {function} expecting redux's dispatch and getState
 */
export function createPeriodicalRPCAction(
  rpcId,
  apiFn,
  params,
  interval = DefaultIntervalMs,
  firstCall = true
) {
  return (dispatch, getState) => {
    // cancels previous timeout in case one was already defined
    clearTimeout(RPCTimeouts[rpcId]);
    // nullifies any previous 'stoped' flag as we're setting a new subscription
    RPCTimeouts[rpcId] = null;

    // when this action is first called, it trigger an 'start' action
    // in the next iterarions, only a 'request' action is generated
    if (firstCall) {
      dispatch(createAction(actionNames[rpcId].start)(params));
    }

    // dispatchs RCP and listens for call
    return dispatch(createRPCAction(rpcId, apiFn, params)).then(action => {
      // if it's flagged as stopped we will not evaluate the interval
      if (RPCTimeouts[rpcId] !== 'stopped') {
        // on action return, we use the intevral function or value to set the next interval
        const wait =
          typeof interval === 'function' ? interval(action, dispatch, getState) : interval;
        // if interval is false or null, we know that we're not supposed to continue polling
        if (wait || wait === 0) {
          RPCTimeouts[rpcId] = setTimeout(() => {
            createPeriodicalRPCAction(rpcId, apiFn, params, interval, false)(dispatch, getState);
          }, wait);
        }
      }

      // returns the action in case there's a chained promise waiting
      return action;
    });
  };
}

/* Cancels any previously defined RPC action from beind performed
 * Flags the rpcId as stopped, so any ongoing RPC action will know that
 * it must initiate a new interval
 * @param {string} rpcId
 */
export function stopPeriodicalRPCAction(rpcId) {
  clearTimeout(RPCTimeouts[rpcId]);
  RPCTimeouts[rpcId] = 'stopped';
  return createAction(actionNames[rpcId].stop)();
}

/* Creates an RPC action
 * @param {string} rpcId
 * @param {function} apiFn: async function to be executed, must return a promise
 * @param {object} params to be passed to apiFn
 * @return {function} expecting redux's dispatch and getState
 */
export function createRPCAction(rpcId, apiFn, params) {
  return (dispatch, getState) => {
    const { request, success, failure } = actionNames[rpcId];
    dispatch({ type: request, payload: params });
    return apiFn(params).then(
      data => {
        const action = { type: success, payload: { ...params, resp: data } };
        dispatch(action);
        return Promise.resolve(action);
      },
      error => {
        const action = { type: failure, payload: { ...params, error } };
        dispatch(action);
        return Promise.resolve(action);
      }
    );
  };
}

/* Creates an RPC reducer
 * @param {string} rpcId
 * @param {reducer} reducers including optional keys: request, success and failure
 * @return {function} combined reducer
 */
export function createRPCReducer(rpcId, reducers = {}) {
  var names = actionNames[rpcId];
  const stages = ['start', 'request', 'success', 'failure', 'stop'];
  Object.keys(reducers).forEach(key => {
    if (stages.indexOf(key) === -1) {
      throw new Error(
        `createRPCReducer doesn't accept "${key}" as a valid reducer key. Use [request, success, failure] as possible values`
      );
    }
  });

  return function rpcReducer(state = {}, action = {}) {
    // it'll dismiss all non-rpc actions
    if (action.type && action.type.substr(0, 9) === '@moon-rpc') {
      if (names.start === action.type && reducers.request) {
        return reducers.start(state, action);
      }
      if (names.request === action.type && reducers.request) {
        return reducers.request(state, action);
      }
      if (names.success === action.type && reducers.success) {
        return reducers.success(state, action);
      }
      if (names.failure === action.type && reducers.failure) {
        return reducers.failure(state, action);
      }
      if (names.stop === action.type && reducers.request) {
        return reducers.stop(state, action);
      }
    }
    return state;
  };
}
