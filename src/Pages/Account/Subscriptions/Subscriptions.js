import React from 'react';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';

import { Button } from 'components/Button';
import Pricing from './Pricing/Pricing';

import './Subscriptions.scss';

export class Subscriptions extends React.Component {
  upgradeAccount() {}
  render() {
    const title = 'Subscription';
    const { props } = this;
    const { plan } = props;
    const _plan = plan || 'Basic Plan (Free forever)';
    return (
      <div className="content Subscription__container">
        <Helmet>
          <title>{title} - Moon Assist</title>
        </Helmet>

        <div className="content__header">
          <h1 className="content__title">{title}</h1>
        </div>

        <div className="content__body">
          <div className="content__section">
            <h2 className="content__headline">
              Current Subscription: <span className="header__type--success">{_plan}</span>
            </h2>
            <p className="content__headline--subhead">
              Upgrade you account and trade like a pro with the premium plan.
            </p>
            <div className="content__section">
              <Pricing />
            </div>
            <Button onClick={this.upgradeAccount}>Upgrade your account</Button>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user,
  account: state.account
});

export default connect(mapStateToProps)(Subscriptions);
