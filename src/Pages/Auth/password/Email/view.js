import React from 'react';
import { Loading, ErrorMessage } from '../../utils';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { forgotPasswordUser } from '_actions/user.actions';
import { VerificationPage } from '../../Verification';

import Form from './form';

class PasswordPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  renderHintFragment() {
    return (
      <p>
        Looking for the log in page?{' '}
        <Link to="/auth/login" className="form__link">
          Log in Here
        </Link>
      </p>
    );
  }

  onSubmit(data) {
    this.props.dispatch(forgotPasswordUser(data)).then(
      res => {
        this.setState({
          finished: true,
          ...data
        });
      },
      () => {}
    );
  }

  renderContent() {
    return (
      <React.Fragment>
        <div className="PublicArea__form-hint">
          <p>Enter your email address below, and we'll send instructions for setting a new one.</p>
        </div>
        <div className="PublicArea__form">
          <Form disabled={this.state.disabled} onSubmit={data => this.onSubmit(data)} />
        </div>
      </React.Fragment>
    );
  }

  renderFinished(email) {
    const fragment = (
      <React.Fragment>
        {"We've sent a message to "}
        <span className="variable--success">{email}</span>
        {' with instruction on how to reset your password'}
      </React.Fragment>
    );
    return <VerificationPage {...this.props} message={fragment} />;
  }

  render() {
    const { props, state } = this;
    return (
      <React.Fragment>
        <Helmet>
          <title>Forgot your password - Moon Assist</title>
        </Helmet>
        <div className="PublicArea__box">
          {state.finished ? null : <h2 className="PublicArea__headline">Reset Password</h2>}
          {props.user.meta.error ? <ErrorMessage error={props.user.meta.errorMessage} /> : null}
          {props.user.meta.loading ? <Loading /> : null}
          {state.finished ? this.renderFinished(state.email) : this.renderContent()}
        </div>
        <div className="PublicArea__hint">{this.renderHintFragment()}</div>
      </React.Fragment>
    );
  }
}

export default PasswordPage;
