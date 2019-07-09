import React from 'react';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';

import Profile from './Profile/Profile';
import Exchanges from './Exchanges/Exchanges';
import LoginHistory from '../Security/LoginHistory/LoginHistory';

export class AccountSummary extends React.Component {
  renderContent() {
    const { account, user, exchanges } = this.props;
    return (
      <React.Fragment>
        <div className="content__section content__section--border">
          <Profile account={account} user={user} />
        </div>

        <div className="content__section content__section--border">
          <div className="content__section-header">
            <h2 className="content__headline">Exchanges</h2>
            <Link to="/account/exchanges" className="content__section-link">
              Modify
            </Link>
          </div>
          <Exchanges exchanges={exchanges} />
        </div>

        <div className="content__section">
          <div className="content__section-header">
            <h2 className="content__headline">Login history</h2>
            <Link to="/account/security#login-history" className="content__section-link">
              View all
            </Link>
          </div>
          <LoginHistory loginEvents={account.loginEvents} limit={5} />
        </div>
      </React.Fragment>
    );
  }

  // TODO: top level page layout could be abstracted to HOC
  render() {
    const title = 'Account Summary';
    return (
      <div className="content">
        <Helmet>
          <title>{title} - Moon Assist</title>
        </Helmet>
        <div className="content__body">{this.renderContent()}</div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user,
  account: state.account,
  exchanges: state.exchanges
});

export default connect(mapStateToProps)(AccountSummary);
