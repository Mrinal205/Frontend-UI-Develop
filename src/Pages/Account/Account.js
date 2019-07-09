import React from 'react';
import { connect } from 'react-redux';
import { NavLink, Switch, Route, Redirect } from 'react-router-dom';

import AccountSummary from './AccountSummary/AccountSummary';
import Exchanges from './Exchanges/Exchanges';
import PersonalData from './PersonalData/PersonalData';
import Security from './Security/Security';
import Settings from './Settings/Settings';

import { SocialMediaLinks } from 'components/AppFooter/AppFooter';

import { getAccount } from '_actions/account.actions';

import { openExternalLink } from '_helpers/links';

import './Account.scss';

const ROUTES = {
  summary: { path: '/account/summary', label: 'Overview' },
  personalData: { path: '/account/personal-data', label: 'Personal Data' },
  settings: { path: '/account/settings', label: 'Settings' },
  // subscriptions: { path: '/account/subscriptions', label: 'Subscriptions' },
  exchanges: { path: '/account/exchanges', label: 'Connected Exchanges' },
  security: { path: '/account/security', label: 'Security Settings' }
};

export const NavigationItem = ({ route, routeKey }) => (
  <NavLink
    to={route.path}
    className={`Account__nav-link`}
    activeClassName="Account__nav-link--is-active"
  >
    <i className={`Account__nav-link-icon Account__nav-link-icon--${routeKey}`} />
    {route.label}
  </NavLink>
);

export const Navigation = ({ routes }) => {
  return (
    <nav className="Account__nav">
      {Object.keys(routes).map(route => (
        <NavigationItem key={`nav-item-${route}`} routeKey={route} route={routes[route]} />
      ))}
    </nav>
  );
};

export const PageHelp = () => (
  <div className="Account__help">
    <strong className="Account__help-headline">Have questions?</strong>
    <p>
      {'Visit our '}
      <a href="https://www.moonassist.com/support#faq" onClick={openExternalLink}>
        FAQ's page
      </a>
      {' or contact our '}
      <a href="https://www.moonassist.com/support" onClick={openExternalLink}>
        customer support
      </a>
    </p>
  </div>
);

export class Account extends React.Component {
  componentDidMount() {
    const { user, getAccount } = this.props;
    getAccount(user.accountId, false);
  }

  render() {
    return (
      <div className="Account">
        <div className="Account__sidebar">
          <Navigation routes={ROUTES} />
          <div className="Account__foot">
            <PageHelp />
            <SocialMediaLinks />
            <p className="Account__copyright">© Moon Assist 2018</p>
          </div>
        </div>
        <div className="Account__content">
          <Switch>
            <Route path={ROUTES.summary.path} component={AccountSummary} />
            <Route path={ROUTES.personalData.path} component={PersonalData} />
            <Route path={ROUTES.exchanges.path} component={Exchanges} />
            {/* <Route path={ROUTES.subscriptions.path} component={Subscriptions} /> */}
            <Route path={ROUTES.settings.path} component={Settings} />
            <Route path={ROUTES.security.path} component={Security} />
            <Redirect to={ROUTES.summary.path} />
          </Switch>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user
});

const mapDispatchToProps = {
  getAccount
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Account);
