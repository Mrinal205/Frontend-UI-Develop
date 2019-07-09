import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';

import { Shakeable } from 'components/Shakeable';
import { Loading, ErrorMessage } from 'Pages/Auth/utils';
import RegisterForm from '../RegisterForm/RegisterForm';

export class RegisterPage extends React.Component {
  state = {
    newsletter: false
  };

  renderErrors() {
    const { user } = this.props;
    let { error, errorMessage } = user.meta;

    if (errorMessage === 'Failed to fetch') {
      errorMessage = 'Sorry, the service is not available. Please try again in few minutes.';
    }

    if (error) {
      return <ErrorMessage error={errorMessage} />;
    }

    return null;
  }

  renderHint() {
    return (
      <p>
        Create a free Moon Assist account and start trading <br />
        like a pro.
        {' Already have an account? '}
        <Link to="/auth/login" className="form__link">
          Log in here
        </Link>
      </p>
    );
  }

  render() {
    const { user, handleSubmit, handleSubmitError, submitError } = this.props;
    const { newsletter } = this.state;

    return (
      <React.Fragment>
        <Helmet>
          <title>Create a Free Account - Moon Assist</title>
        </Helmet>

        <Shakeable shouldShake={user.meta.error || submitError}>
          <div className="PublicArea__box">
            <h2 className="PublicArea__headline">Create a Free Account</h2>
            {this.renderErrors()}
            {user.meta.loading ? <Loading /> : null}
            <div className="PublicArea__form">
              <RegisterForm
                onSubmitFail={handleSubmitError}
                onSubmit={data => {
                  return handleSubmit({
                    newsletter,
                    ...data
                  });
                }}
                newsletter={newsletter}
                onNewsletterChange={e => {
                  this.setState({ newsletter: e.target.checked });
                }}
              />
            </div>
          </div>
        </Shakeable>
        <div className="PublicArea__hint">{this.renderHint()}</div>
      </React.Fragment>
    );
  }
}

export default RegisterPage;
