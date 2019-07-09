import { CancelToken } from 'axios';

// We'll store the cancelTokens for each rpcId here
const CurrentRequests = {};

/* Prevents from having two or more simultaneous RPC requests of the same type
 * by cancelling previous requests when a new one is started.
 * Example:
 *    while we're wating for openOrders for a market, the user switchs to another symbol
 *    In that case, we cancel the previous request and start another for one for the new the user
 * @param {string} rpcId - identifies the type of request
 * @param {function} fn - fn that executes an axios request
   `fn` will be passed a cancelToken, which must include as an option to the axios request
   Example of fn:
      (cancelToken) => instance.get(`/orders/${exchangeName}/${symbol}`, {cancelToken})
 * @return {promise} fn must return a promise to keep the chain
 */
export function uniqueRequestById(rpcId, fn) {
  if (CurrentRequests[rpcId]) {
    CurrentRequests[rpcId].cancel();
  }
  CurrentRequests[rpcId] = CancelToken.source();
  return fn(CurrentRequests[rpcId].token);
}
