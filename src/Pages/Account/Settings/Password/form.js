import React from 'react';
import { reduxForm } from 'redux-form';
import { Field } from 'redux-form';
import { required, length } from 'redux-form-validators';

import { FormField } from 'components/FormField';
import { Button } from 'components/Button';
import { Hint } from 'components/Hint';

export const PasswordForm = props => {
  const { handleSubmit, meta } = props;
  return (
    <form onSubmit={handleSubmit} className="form" noValidate autoComplete="off">
      <div className="form__row form__row--short">
        <Field
          name="oldPassword"
          component={FormField}
          type="password"
          label="Old Password:"
          required={true}
          validate={[required()]}
          autoFocus
        />
      </div>
      <div className="form__row form__row--short">
        <Field
          name="newPassword"
          component={FormField}
          type="password"
          label="New Password:"
          required={true}
          autoComplete="new-password"
          validate={[required(), length({ min: 8 })]}
        />
      </div>
      <div className="form__row form__row--actions form__row--short">
        <Button loading={meta.loading}>Set new password</Button>

        {meta.updated && <Hint type="success">Your password has been changed successfully.</Hint>}

        {meta.error && <Hint type="error">{meta.errorMessage}</Hint>}
      </div>
    </form>
  );
};

export default reduxForm({ form: 'passwordChangeForm' })(PasswordForm);
