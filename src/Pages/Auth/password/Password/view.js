import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Loading, ErrorMessage } from '../../utils';
import { resetPasswordUser } from '_actions/user.actions';
import { parse } from 'query-string';
import Form from './form';

class Password extends React.Component {
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

  renderContent() {
    return (
      <React.Fragment>
        <div className="PublicArea__form-hint">
          <p>Enter a new password to access your account.</p>
        </div>
        <div className="PublicArea__form">
          <Form onSubmit={data => this.onSubmit(data)} />
        </div>
      </React.Fragment>
    );
  }

  onSubmit(values) {
    const { code, email } = parse(this.props.location.search);
    this.props
      .dispatch(
        resetPasswordUser({
          code,
          email: email.replace(' ', '+'),
          ...values
        })
      )
      .then(
        res => {
          this.setState({
            finished: true
          });
        },
        () => {}
      );
  }

  renderFinished() {
    return (
      <React.Fragment>
        <h2 className="PublicArea__headline">Success</h2>
        <div className="PublicArea__box--thin">
          <div className="form__row">
            <p className="PublicArea__message">You have changed your password.</p>
            <button
              className="button button--block"
              onClick={e => {
                this.props.history.push('/auth/login');
              }}
            >
              Continue
            </button>
          </div>
        </div>
      </React.Fragment>
    );
  }

  render() {
    const { state, props } = this;
    return (
      <React.Fragment>
        <Helmet>
          <title>Forgot your password - Moon Assist</title>
        </Helmet>
        <div className="PublicArea__box PublicArea__box--centered">
          {state.finished ? null : <h2 className="PublicArea__headline">Set New Password</h2>}
          {props.user.meta.error ? <ErrorMessage error={props.user.meta.errorMessage} /> : null}
          {props.user.meta.loading ? <Loading /> : null}
          {state.finished ? this.renderFinished() : this.renderContent()}
        </div>
        <div className="PublicArea__hint">{this.renderHintFragment()}</div>
      </React.Fragment>
    );
  }
}
export default Password;
