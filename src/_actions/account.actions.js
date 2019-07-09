import AccountService from '_services/account.service';
import { getExchangesSuccess } from './exchanges.actions';

export const GET_ACCOUNT_REQUEST = 'GET_ACCOUNT_REQUEST';
export const GET_ACCOUNT_SUCCESS = 'GET_ACCOUNT_SUCCESS';
export const GET_ACCOUNT_ERROR = 'GET_ACCOUNT_ERROR';

export function getAccountRequest() {
  return {
    type: GET_ACCOUNT_REQUEST
  };
}
export function getAccountSuccess(account) {
  return {
    type: GET_ACCOUNT_SUCCESS,
    account
  };
}
export function getAccountError(error) {
  return {
    type: GET_ACCOUNT_ERROR,
    error
  };
}

export function getAccount(accountId, showLoading = true) {
  return dispatch => {
    if (showLoading) {
      dispatch(getAccountRequest());
    }
    return AccountService.get(accountId).then(
      account => {
        dispatch(getExchangesSuccess(account.exchanges));
        dispatch(getAccountSuccess(account));
      },
      error => dispatch(getAccountError(error))
    );
  };
}
export const UPDATE_ACCOUNT_REQUEST = 'UPDATE_ACCOUNT_REQUEST';
export const UPDATE_ACCOUNT_SUCCESS = 'UPDATE_ACCOUNT_SUCCESS';
export const UPDATE_ACCOUNT_ERROR = 'UPDATE_ACCOUNT_ERROR';
export const UPDATE_ACCOUNT_RESET = 'UPDATE_ACCOUNT_RESET';

export function updateAccountRequest(account) {
  return {
    type: UPDATE_ACCOUNT_REQUEST,
    account
  };
}
export function updateAccountSuccess() {
  return {
    type: UPDATE_ACCOUNT_SUCCESS
  };
}
export function updateAccountError(error) {
  return {
    type: UPDATE_ACCOUNT_ERROR,
    error
  };
}
export function updateAccount(account) {
  return dispatch => {
    dispatch(updateAccountRequest(account));
    return AccountService.update(account).then(
      () => dispatch(updateAccountSuccess()),
      error => dispatch(updateAccountError(error))
    );
  };
}
export function updateAccountReset() {
  return {
    type: UPDATE_ACCOUNT_RESET
  };
}
export const ADD_EMAIL_SUBSCRIPTION_REQUEST = 'ADD_EMAIL_SUBSCRIPTION_REQUEST';
export const ADD_EMAIL_SUBSCRIPTION_SUCCESS = 'ADD_EMAIL_SUBSCRIPTION_SUCCESS';
export const ADD_EMAIL_SUBSCRIPTION_ERROR = 'ADD_EMAIL_SUBSCRIPTION_ERROR';

export function addEmailSubscriptionRequest(subscription) {
  return {
    type: ADD_EMAIL_SUBSCRIPTION_REQUEST,
    subscription
  };
}
export function addEmailSubscriptionSuccess(subscription) {
  return {
    type: ADD_EMAIL_SUBSCRIPTION_SUCCESS,
    subscription
  };
}
export function addEmailSubscriptionError(error) {
  return {
    type: ADD_EMAIL_SUBSCRIPTION_ERROR,
    error
  };
}
export function addEmailSubscription(subscription, accountId) {
  return dispatch => {
    dispatch(addEmailSubscriptionRequest(subscription));
    return AccountService.addSubscription(subscription, accountId).then(
      data => dispatch(addEmailSubscriptionSuccess(data)),
      error => dispatch(addEmailSubscriptionError(error))
    );
  };
}
export const REMOVE_EMAIL_SUBSCRIPTION_REQUEST = 'REMOVE_EMAIL_SUBSCRIPTION_REQUEST';
export const REMOVE_EMAIL_SUBSCRIPTION_SUCCESS = 'REMOVE_EMAIL_SUBSCRIPTION_SUCCESS';
export const REMOVE_EMAIL_SUBSCRIPTION_ERROR = 'REMOVE_EMAIL_SUBSCRIPTION_ERROR';

export function removeEmailSubscriptionRequest(subscription) {
  return {
    type: REMOVE_EMAIL_SUBSCRIPTION_REQUEST,
    subscription
  };
}
export function removeEmailSubscriptionSuccess() {
  return {
    type: REMOVE_EMAIL_SUBSCRIPTION_SUCCESS
  };
}
export function removeEmailSubscriptionError(error) {
  return {
    type: REMOVE_EMAIL_SUBSCRIPTION_ERROR,
    error
  };
}
export function removeEmailSubscription(subscription, accountId) {
  return dispatch => {
    dispatch(removeEmailSubscriptionRequest(subscription));
    return AccountService.removeSubscription(subscription, accountId).then(
      () => dispatch(removeEmailSubscriptionSuccess()),
      error => dispatch(removeEmailSubscriptionError(error))
    );
  };
}
