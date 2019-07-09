export const actionIds = mirrorDecamelized([
  'setCurrentTradingMarket',
  'createNotification',
  'removeNotification',
  'initializeOrderValues',
  'changeOrderValue',
  'rejectOrder',
  'selectOrdersPage'
]);

export const rpcIds = mirror([
  'fetchBalance',
  'submitOrder',
  'fetchOrders',
  'cancelOrder',
  'fetchExchangeOrders',
  'fetchExchangeBalance'
]);

export const actionNames = createActionNames(rpcIds);

/* Creates RPC action names for each rpcId
 * @param {object} rpcIds => {fecthAction: 'fecthAction'}
 * @return {object} {fecthAction: {
 *   stop: '@moon-rpc/FETCH_ACTION_STOP'
 *   start: '@moon-rpc/FETCH_ACTION_START'
 *   request: '@moon-rpc/FETCH_ACTION_REQUEST'
 *   success: '@moon-rpc/FETCH_ACTION_SUCCESS'
 *   failure: '@moon-rpc/FETCH_ACTION_FAILURE'
 * }}
 */
export function createActionNames(rpcIds) {
  return Object.keys(rpcIds).reduce((prev, id) => {
    const stages = ['start', 'request', 'success', 'failure', 'stop'];
    prev[rpcIds[id]] = stages.reduce((group, stage) => {
      group[stage] = `@moon-rpc/${camelUpper(rpcIds[id])}_${stage.toUpperCase()}`;
      return group;
    }, {});
    return prev;
  }, {});
}

/* Decamelizes a string
 * @param {string} key => 'camelCaseKey'
 * @retrun {string} 'CAMEL_CASE_KEY'
 */
export function camelUpper(key) {
  return key.replace(/([A-Z])/g, '_$1').toUpperCase();
}

/* Takes an array of strings and returns an object mirroring the keys' names
 * @param {array} ids => ['camelCaseKey']
 * @return {object} {camelCaseKey: 'camelCaseKey'}
 */
export function mirror(ids) {
  return ids.reduce((prev, id) => {
    prev[id] = id;
    return prev;
  }, {});
}

/* Takes an array of strings and returns an object mirroring the keys' names
 * but adding a prefix and decamelizing
 * @param {array} ids => ['camelCaseKey']
 * @return {object} {camelCaseKey: '@moon/CAMEL_CASE_KEY'}
 */
export function mirrorDecamelized(ids) {
  return ids.reduce((prev, id) => {
    prev[id] = `@moon/${camelUpper(id)}`;
    return prev;
  }, {});
}
