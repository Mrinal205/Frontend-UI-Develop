import ReactGA from 'react-ga';
import { GOOGLE_ANALYTICS_ID } from '../_constants';

export function trackPageView(path = '/') {
  if (GOOGLE_ANALYTICS_ID) {
    ReactGA.pageview(path);
  }
}

export function trackModalView(modalName) {
  if (GOOGLE_ANALYTICS_ID) {
    ReactGA.modalview(modalName);
  }
}

export function trackEvent(category, action, ...rest) {
  if (GOOGLE_ANALYTICS_ID) {
    ReactGA.event({
      category,
      action,
      ...rest
    });
  }
}

export default function configureTracking() {
  if (GOOGLE_ANALYTICS_ID) {
    ReactGA.initialize(GOOGLE_ANALYTICS_ID, {
      debug: process.env.NODE_ENV === 'development'
    });
  }
}
