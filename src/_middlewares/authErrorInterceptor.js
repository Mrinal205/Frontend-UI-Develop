import { GET_ACCOUNT_ERROR } from '_actions/account.actions';
import { logoutUser } from '_actions/user.actions';

const isUnauthorizedAction = action => {
  const isUnauthorized = action.error && action.error.status === 403;
  const isFailedRequest = action.type === GET_ACCOUNT_ERROR;
  return isUnauthorized || isFailedRequest;
};

const authErrorInterceptor = store => next => action => {
  if (isUnauthorizedAction(action)) {
    console.log('Intercepted 403');
    return next(logoutUser());
  }
  return next(action);
};

export default authErrorInterceptor;
