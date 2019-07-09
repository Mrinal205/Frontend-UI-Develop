import { fetch } from './fetch';

function register(user) {
  return fetch('users', user);
}

function resetPassword(user) {
  return fetch('users/forgotpassword/verify', user);
}

function forgotPassword(user) {
  return fetch('users/forgotpassword', user);
}

function verify(user) {
  return fetch('users/validate', user);
}

function login(user) {
  return fetch('users/authenticate', user);
}

function login2fa(user) {
  return fetch('2fa/authenticate', user);
}

function updatePassword(id, infos) {
  return fetch(`users/${id}/password`, infos, {
    method: 'PATCH'
  });
}

function update(id, user) {
  return fetch(`users/${id}/email`, user, {
    method: 'PUT'
  });
}

function apiLogout() {
  return fetch('users/authenticate', undefined, { method: 'DELETE' });
}

function appLogout() {
  return new Promise((resolve, reject) => {
    try {
      resolve(localStorage.removeItem('user'));
    } catch (err) {
      console.error(err);
    }
    resolve('Cannot access local storage');
  });
}

function restore() {
  try {
    const user = localStorage.getItem('user');
    if (user) {
      return JSON.parse(user);
    }
  } catch (err) {
    return false;
  }

  return false;
}

function store(user) {
  return new Promise((resolve, reject) => {
    try {
      localStorage.setItem('user', JSON.stringify(user));
      resolve(user);
    } catch (err) {
      console.error(err);
    }
    reject('Cannot access local storage');
  });
}
export const UserService = {
  login,
  login2fa,
  apiLogout,
  appLogout,
  register,
  restore,
  store,
  verify,
  update,
  forgotPassword,
  resetPassword,
  updatePassword
};
