import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import authErrorInterceptor from '_middlewares/authErrorInterceptor';
import { composeWithDevTools } from 'redux-devtools-extension';

import rootReducer from './../_reducers';

const configureStore = () => {
  const middlewares = [authErrorInterceptor, thunkMiddleware];

  // redux devtools
  const enhancers =
    process.env.NODE_ENV === 'development'
      ? composeWithDevTools(applyMiddleware(...middlewares))
      : applyMiddleware(...middlewares);

  // create redux store
  const store = createStore(rootReducer, enhancers);
  return store;
};

export default configureStore;
