import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Loading, ErrorMessage } from '../../utils';
import { Shakeable } from 'components/Shakeable';
import { openExternalLink } from '_helpers/links';

import LoginForm from '../LoginForm/LoginForm';
import TwoFactorAuthForm from '../TwoFactorAuthForm/TwoFactorAuthForm';

export class LoginPage extends React.Component {
  renderErrors() {
    const { user } = this.props;
    let { errorMessage } = user.meta;

    if (errorMessage === 'Failed to fetch') {
      errorMessage = 'Sorry, the service is not available. Please try again in few minutes.';
    }

    if (user.meta.error) {
      return <ErrorMessage error={errorMessage} />;
    }

    return null;
  }

  renderHint() {
    return (
      <p>
        {'Need a Moon Assist account? '}
        <Link to="/auth/register" className="form__link">
          Create an account
        </Link>
      </p>
    );
  }

  renderIssueLink() {
    const link =
      'https://www.moonassist.com/support#faq-if-i-lose-my-2fa-how-do-i-log-in-or-reset-my-moon-assist-account';

    return (
      <div className="form__row form__row--center">
        <a href={link} className="form__link link--primary" onClick={openExternalLink}>
          Problem logging in with 2FA?
        </a>
      </div>
    );
  }

  render() {
    const { user, handleSubmit, handleSubmitError, submitError } = this.props;

    return (
      <React.Fragment>
        <Helmet>
          <title>Log in - Moon Assist</title>
        </Helmet>

        <Shakeable shouldShake={user.meta.error || submitError}>
          <div className="PublicArea__box">
            <h2 className="PublicArea__headline">
              {user.twoFactorAuthRequired ? 'Enter 2FA Code' : 'Log in'}
            </h2>
            {this.renderErrors()}
            {user.meta.loading && <Loading />}
            {user.twoFactorAuthRequired ? (
              <React.Fragment>
                <div className="PublicArea__form PublicArea__form--separated">
                  <TwoFactorAuthForm onSubmit={handleSubmit} onSubmitFail={handleSubmitError} />
                  {this.renderIssueLink()}
                </div>
              </React.Fragment>
            ) : (
              <div className="PublicArea__form">
                <LoginForm onSubmit={handleSubmit} onSubmitFail={handleSubmitError} />
              </div>
            )}
          </div>
        </Shakeable>

        <div className="PublicArea__hint">{this.renderHint()}</div>
      </React.Fragment>
    );
  }
}

export default LoginPage;
