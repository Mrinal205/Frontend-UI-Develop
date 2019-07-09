import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { required, length } from 'redux-form-validators';

import { FormField } from 'components/FormField';

export const ForgotPasswordForm = ({ handleSubmit }) => (
  <form onSubmit={handleSubmit} className="form" noValidate autoComplete="off">
    <div className="form__row">
      <Field
        name="password"
        component={FormField}
        type="password"
        label="Password:"
        autoComplete="new-password"
        placeholder=""
        validate={[required(), length({ min: 8 })]}
      />
      <div className="form__row form__row--actions">
        <button className="button button--block">Set New Password</button>
      </div>
    </div>
  </form>
);

export default reduxForm({ form: 'register' })(ForgotPasswordForm);
