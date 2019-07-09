import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';

import configureStore from './_store/configureStore';
import configureValidators from './_validators/configureValidators';
import configureSentry from './_vendors/sentry';
import configureTracking from './_vendors/analytics';

import Application from './Application';
import ErrorBoundary from 'components/ErrorBoundary/ErrorBoundary';

export function initialize(rootSelector) {
  // initialize Sentry
  configureSentry();

  // initialize redux store
  const store = configureStore();

  // configure some global values for form validations
  configureValidators();

  // configure GA
  configureTracking();

  render(
    <Provider store={store}>
      <ErrorBoundary>
        <Application />
      </ErrorBoundary>
    </Provider>,
    document.getElementById(rootSelector)
  );
}

initialize('moon-assist-root');
