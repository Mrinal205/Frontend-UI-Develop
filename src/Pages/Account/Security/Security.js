import React from 'react';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';

import LoginHistory from './LoginHistory/LoginHistory';
import TwoFactorAuth from './TwoFactorAuth/TwoFactorAuth';
import { HelpTip } from 'components/HelpTip';

export class Security extends React.Component {
  renderContent() {
    const { account, user } = this.props;

    return (
      <React.Fragment>
        <div className="content__section content__section--border">
          <h2 className="content__headline">2FA Authentication</h2>
          <TwoFactorAuth account={account} user={user} />
        </div>

        <div className="content__section">
          <div className="content__section-header">
            <h2 className="content__headline">
              Login history
              <HelpTip>
                <p>
                  Below, you'll find last 25 events from your login history.
                  <br />
                  If you see any login you don't recognize, please contact our support team!
                </p>
              </HelpTip>
            </h2>
          </div>
          <LoginHistory loginEvents={account.loginEvents} limit={25} />
        </div>
      </React.Fragment>
    );
  }

  render() {
    const title = 'Security Settings';
    return (
      <div className="content">
        <Helmet>
          <title>{title} - Moon Assist</title>
        </Helmet>

        <div className="content__header">
          <h1 className="content__title">{title}</h1>
        </div>

        <div className="content__body">{this.renderContent()}</div>
      </div>
    );
  }
}

const mapStateToProps = ({ account, user }) => ({ account, user });
export default connect(mapStateToProps)(Security);
