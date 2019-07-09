import React from 'react';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { parse } from 'query-string';
import { Redirect } from 'react-router-dom';

import Spinner from 'components/Spinner';
import { verifyUser } from '_actions/user.actions';

const Loading = () => (
  <div className="PublicArea__loading PublicArea__loading--alt">
    <Spinner size="big" color="blue" />
  </div>
);

const ErrorMessage = ({ error }) => <div className="PublicArea__error">{error}</div>;

export class VerificationPage extends React.Component {
  constructor(props) {
    super(props);
    this.checkVerificationParams();
  }

  checkVerificationParams() {
    const { location, verifyUser } = this.props;
    const params = parse(location.search);

    if (params.userId && params.code) {
      verifyUser(params);
    }
  }

  renderContent() {
    const { user } = this.props;
    if (user.meta.error) {
      return <ErrorMessage error={user.meta.errorMessage} />;
    }

    if (user.meta.loading) {
      return <Loading />;
    }

    const message = this.props.message || (
      <React.Fragment>
        {'We’ve sent a message to '}
        <span className="variable--success">{user.email}</span>
        {'. Open it up and click Activate Account and we’ll take it from there.'}
      </React.Fragment>
    );
    return <p className="PublicArea__message">{message}</p>;
  }

  render() {
    const { user } = this.props;

    // registered & confirmed or no email knownr
    if ((user.userId && user.accountId) || user.email === undefined) {
      return <Redirect to="/" />;
    }

    const title = user.meta.loading ? 'Verifying account...' : 'Check your email!';

    return (
      <React.Fragment>
        <Helmet>
          <title>{title} - Moon Assist</title>
        </Helmet>

        <div className="PublicArea__box">
          <h2 className="PublicArea__headline">{title}</h2>
          {this.renderContent()}
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user
});

const mapDispatchToProps = {
  verifyUser
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(VerificationPage);
