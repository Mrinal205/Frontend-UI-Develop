import React from 'react';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';

import PersonalDataForm from './Form/Form';
import { updateAccount, updateAccountReset } from '_actions/account.actions';

export class PersonalData extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentWillUnmount() {
    this.props.dispatch(updateAccountReset());
  }

  handleSubmit(values) {
    this.props.dispatch(updateAccount(values));
  }

  render() {
    const { account } = this.props;
    const title = 'Personal Data';
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
            <PersonalDataForm
              account={account}
              initialValues={account}
              onSubmit={this.handleSubmit}
            />
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

export default connect(mapStateToProps)(PersonalData);
