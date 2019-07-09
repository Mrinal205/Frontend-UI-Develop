import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { required, email } from 'redux-form-validators';

import { FormField } from 'components/FormField';

export const ForgotPasswordForm = ({ handleSubmit, account }) => (
  <form onSubmit={handleSubmit} className="form" noValidate autoComplete="off">
    <div className="form__row">
      <Field
        name="email"
        component={FormField}
        type="email"
        label="Email:"
        placeholder=""
        validate={[required(), email()]}
      />
      <div className="form__row form__row--actions">
        <button className="button button--block">Reset Password</button>
      </div>
    </div>
  </form>
);

export default reduxForm({ form: 'register' })(ForgotPasswordForm);
