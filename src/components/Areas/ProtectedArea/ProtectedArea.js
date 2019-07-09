import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Switch, Redirect } from 'react-router-dom';
import { withRouter } from 'react-router';
import IdleTimer from 'react-idle-timer';

import PrivateRoute from 'components/PrivateRoute/PrivateRoute';

import Spinner from 'components/Spinner/Spinner';
import AppLayout from 'components/AppLayout/AppLayout';
import ErrorBoundary from 'components/ErrorBoundary/ErrorBoundary';
import NotificationsPublisher from 'components/NotificationsPublisher/NotificationsPublisher';

import Account from 'Pages/Account/Account';
import DashboardContainer from 'Pages/Dashboard/DashboardContainer';
import MarketOverview from 'Pages/Market/MarketOverviewContainer';
import MarketDetails from 'Pages/Market/MarketDetailsContainer';
import NotFound from 'Pages/NotFound/NotFound';
import WalletContainer from 'Pages/Wallet/WalletContainer';

import { getAccount } from '_actions/account.actions';
import { removeNotification } from '_actions/notifications.actions';
import { logoutUser } from '_actions/user.actions';

import { IDLE_TIMEOUT } from '_constants';
import { trackPageView } from '_vendors/analytics';

import './ProtectedArea.scss';

export class ProtectedArea extends Component {
  componentWillMount() {
    const { user, getAccount } = this.props;
    getAccount(user.accountId);
  }

  componentDidMount() {
    this.trackPageView(this.props.location.pathname);
  }

  componentDidUpdate(prevProps) {
    const { location } = this.props;
    if (location.pathname !== prevProps.location.pathname) {
      this.trackPageView(location.pathname);
    }
  }

  trackPageView(pathname) {
    // do not track market redirect
    if (pathname === 'market') {
      return;
    }

    trackPageView(pathname);
  }

  renderLoading() {
    return (
      <div className="AppLoading">
        <div className="AppLoading__loader">
          <Spinner size="big" color="blue" />
        </div>
      </div>
    );
  }

  render() {
    const { account, notifications, removeNotification, logoutUser, location } = this.props;

    if (account.meta.loading === true) {
      return this.renderLoading();
    }

    // hide footer on account area layouts
    const isAccountArea = location && location.pathname.indexOf('account') > -1;

    return (
      <AppLayout displaFooter={!isAccountArea}>
        <ErrorBoundary retry="Try again">
          <Switch>
            <PrivateRoute path="/dashboard" component={DashboardContainer} />
            <PrivateRoute exact path="/" component={() => <Redirect to="/dashboard" />} />
            <PrivateRoute path="/account" component={Account} />
            <PrivateRoute path="/market/:exchangeName/:marketName" component={MarketDetails} />
            <PrivateRoute path="/market/:exchangeName" component={MarketOverview} />
            <PrivateRoute path="/market" component={() => <Redirect to="/market/BINANCE" />} />
            <PrivateRoute path="/wallet/:exchangeName" component={WalletContainer} />
            <PrivateRoute path="/wallet" component={WalletContainer} />
            <PrivateRoute component={NotFound} />
          </Switch>
          <NotificationsPublisher
            notifications={notifications}
            removeNotification={removeNotification}
          />
          <IdleTimer onIdle={logoutUser} timeout={IDLE_TIMEOUT} />
        </ErrorBoundary>
      </AppLayout>
    );
  }
}

const mapsStateToProps = ({ user, account, notifications }) => ({
  user,
  account,
  notifications
});

const mapDispatchToProps = {
  removeNotification,
  getAccount,
  logoutUser
};

const connectedComponent = connect(
  mapsStateToProps,
  mapDispatchToProps
)(ProtectedArea);

export default withRouter(connectedComponent);
