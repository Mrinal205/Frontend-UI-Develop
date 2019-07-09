import React from 'react';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { EmailPass } from '../EmailPass/EmailPass';

import NotificationsForm from '../NotificationsForm/NotificationsForm';

import { addEmailSubscription, removeEmailSubscription } from '_actions/account.actions';

export class Overview extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    // this should probably go into notifications form
    const { user, emailSubscriptions } = this.props;

    const node = event.target;
    const value = node.value;
    if (node.checked) {
      this.props.dispatch(
        addEmailSubscription(
          {
            type: value
          },
          user.accountId,
          user.token
        )
      );
    } else {
      const subscription = emailSubscriptions.find(s => s.type === value);
      this.props.dispatch(removeEmailSubscription(subscription, user.accountId, user.token));
    }
  }

  render() {
    const title = 'Account Settings';
    const { user } = this.props;
    return (
      <div className="content">
        <Helmet>
          <title>{title} - Moon Assist</title>
        </Helmet>

        <div className="content__header">
          <h1 className="content__title">{title}</h1>
        </div>

        <div className="content__body">
          <div className="content__section">
            <EmailPass user={user} />
          </div>
          <div className="br" />
          <div className="content__section">
            <NotificationsForm
              emailSubscriptions={this.props.emailSubscriptions}
              onInputChange={this.handleChange}
            />
          </div>
        </div>
      </div>
    );
  }
}

const mapsStateToProps = ({ account, user }) => ({
  account,
  user,
  emailSubscriptions: account.emailSubscriptions
});

export default connect(mapsStateToProps)(Overview);
