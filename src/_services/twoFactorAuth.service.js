import { fetch } from './fetch';

function create(userId) {
  const data = {
    userId,
    type: 'time_based'
  };

  return fetch('2fa', data, { method: 'PUT' });
}

function confirm(number, userId) {
  const data = {
    number,
    userId
  };

  return fetch('2fa/confirm', data);
}

function disable(number, userId) {
  const data = {
    number,
    userId
  };

  return fetch('2fa', data, { method: 'DELETE' });
}

export default {
  create,
  confirm,
  disable
};
