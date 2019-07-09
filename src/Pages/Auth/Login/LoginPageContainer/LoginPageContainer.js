import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import { loginUserReset, loginUser, login2faUser } from '_actions/user.actions';
import LoginPage from '../LoginPage/LoginPage';

export class LoginPageContainer extends React.Component {
  static propTypes = {
    user: PropTypes.object,
    loginUserReset: PropTypes.func.isRequired,
    loginUser: PropTypes.func.isRequired,
    login2faUser: PropTypes.func.isRequired
  };

  state = {
    submitError: false
  };

  componentDidMount() {
    this.props.loginUserReset();
  }

  handleSubmit = values => {
    const { loginUser, login2faUser, user } = this.props;
    this.setState({ submitError: false }); // passed
    if (values.number) {
      // Login via 2FA auth if "number" field was provided
      login2faUser({ number: values.number, userId: user.userId });
    } else {
      loginUser(values);
    }
  };

  handleSubmitError = error => {
    this.setState({ submitError: true });
  };

  render() {
    const { user } = this.props;
    if (user.accountId) {
      return <Redirect to={'/'} />;
    }

    const pageProps = {
      user: this.props.user,
      handleSubmit: this.handleSubmit,
      handleSubmitError: this.handleSubmitError,
      submitError: this.state.submitError
    };

    return <LoginPage {...pageProps} />;
  }
}

const mapStateToProps = state => ({
  user: state.user
});

const mapDispatchToProps = {
  loginUser,
  loginUserReset,
  login2faUser
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginPageContainer);
