import React from 'react';
import { Link } from 'react-router-dom';
import { Field, reduxForm } from 'redux-form';
import { required, email } from 'redux-form-validators';

import { FormField } from 'components/FormField';

export const LoginForm = ({ handleSubmit, user }) => {
  return (
    <form onSubmit={handleSubmit} className="form" noValidate>
      <div className="form__row">
        <Field
          name="email"
          component={FormField}
          type="email"
          label="Email:"
          placeholder=""
          validate={[required(), email()]}
          autoFocus
        />
      </div>
      <div className="form__row">
        <Field
          name="password"
          component={FormField}
          type="password"
          label="Password:"
          validate={[required()]}
          placeholder=""
        />
      </div>
      <div className="form__row form__row--actions">
        <button type="submit" className="button button--block">
          Log in
        </button>
      </div>

      <div className="form__row form__row--center">
        <Link to="/auth/forgot" className="form__link link--primary">
          Forgot password?
        </Link>
      </div>
    </form>
  );
};

export default reduxForm({ form: 'login' })(LoginForm);
