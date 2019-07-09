import Raven from 'raven-js';
import { SENTRY_ENDPOINT } from '../_constants';

export default function configureSentry() {
  if (process.env.NODE_ENV === 'development') {
    return;
  }

  Raven.config(SENTRY_ENDPOINT, {
    environment: process.env.NODE_ENV
  }).install();
}
