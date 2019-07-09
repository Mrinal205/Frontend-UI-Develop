import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { required } from 'redux-form-validators';

import { FormField } from 'components/FormField';
import { Button } from 'components/Button';
import { Hint } from 'components/Hint';

export const TwoFactorAuthForm = ({ disable, handleSubmit, twoFactorAuth }) => {
  return (
    <form onSubmit={handleSubmit} className="form" noValidate>
      <div className="form__row form__row--short">
        <Field
          name="number"
          component={FormField}
          type="text"
          placeholder="Enter code"
          validate={[required()]}
          autoComplete="off"
          autoFocus={disable !== true}
        />
      </div>

      <div className="form__row form__row--actions">
        {disable ? (
          <Button danger loading={twoFactorAuth.meta.disabling}>
            Disable 2FA Authentication
          </Button>
        ) : (
          <Button loading={twoFactorAuth.meta.confirming}>Confirm</Button>
        )}

        {twoFactorAuth.meta.error && <Hint type="error">{twoFactorAuth.meta.errorMessage}</Hint>}
      </div>
    </form>
  );
};

export default reduxForm({ form: 'twoFactorAuthForm' })(TwoFactorAuthForm);
