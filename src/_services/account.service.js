import { fetch } from './fetch';

function get(accountId) {
  return fetch(`accounts/${accountId}`, undefined, { method: 'GET' });
}

function update(account) {
  const { personalDetails, address } = account;

  const accountData = {
    address,
    personalDetails
  };

  return fetch(`accounts/${account.id}`, accountData, { method: 'PUT' });
}

function connectExchange(exchange, accountId) {
  return fetch(`accounts/${accountId}/exchanges`, exchange);
}

function disconnectExchange(exchange, accountId) {
  return fetch(`accounts/${accountId}/exchanges/${exchange.id}`, undefined, {
    method: 'DELETE'
  });
}

function addSubscription(subscription, accountId) {
  return fetch(`accounts/${accountId}/emailsubscriptions`, subscription);
}

function removeSubscription(subscription, accountId) {
  return fetch(`accounts/${accountId}/emailsubscriptions/${subscription.id}`, undefined, {
    method: 'DELETE'
  });
}

export default {
  connectExchange,
  disconnectExchange,
  get,
  update,
  addSubscription,
  removeSubscription
};
