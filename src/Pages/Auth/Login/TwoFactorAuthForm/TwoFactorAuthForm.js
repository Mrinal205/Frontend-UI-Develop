import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { required } from 'redux-form-validators';

import { FormField } from 'components/FormField';

export const TwoFactorAuthForm = ({ handleSubmit, user }) => {
  return (
    <form onSubmit={handleSubmit} className="form" noValidate>
      <div className="form__row form__row--input-center">
        <Field
          name="number"
          component={FormField}
          type="text"
          label=""
          validate={[required()]}
          autoFocus
          maxLength="6"
          autoComplete="off"
        />
      </div>
      <div className="form__row form__row--actions">
        <button type="submit" className="button button--block">
          Submit
        </button>
      </div>
    </form>
  );
};

export default reduxForm({ form: 'twoFactorAuth' })(TwoFactorAuthForm);
