import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import { registerUserReset, registerUser } from '_actions/user.actions';
import RegisterPage from '../RegisterPage/RegisterPage';

export class RegisterPageContainer extends React.Component {
  static propTypes = {
    user: PropTypes.object,
    registerUserReset: PropTypes.func.isRequired,
    registerUser: PropTypes.func.isRequired
  };

  state = {
    submitError: false
  };

  componentDidMount() {
    this.props.registerUserReset();
  }

  handleSubmit = values => {
    this.setState({ submitError: false }); // passed validation
    this.props.registerUser(values);
  };

  handleSubmitError = error => {
    this.setState({ submitError: true });
  };

  render() {
    const { user } = this.props;

    // registered & confirmed
    if (user.userId && user.accountId) {
      return <Redirect to="/" />;
    }

    // needs verification
    // this is probably not a good idea. what if 2 people decide
    // to sign up but the first does not verify right away
    if (user.userId) {
      return <Redirect to="/auth/verify" replace={true} />;
    }

    const pageProps = {
      user: this.props.user,
      handleSubmit: this.handleSubmit,
      handleSubmitError: this.handleSubmitError,
      submitError: this.state.submitError
    };

    return <RegisterPage {...pageProps} />;
  }
}

const mapStateToProps = state => ({
  user: state.user
});

const mapDispatchToProps = {
  registerUser,
  registerUserReset
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RegisterPageContainer);
