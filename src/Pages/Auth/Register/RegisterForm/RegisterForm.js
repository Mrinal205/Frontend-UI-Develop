import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { required, email, length, acceptance } from 'redux-form-validators';

import { FormField } from 'components/FormField';
import { openExternalLink } from '_helpers/links';

export const RegisterForm = ({ handleSubmit, newsletter, onNewsletterChange }) => {
  return (
    <form onSubmit={handleSubmit} className="form" noValidate>
      <div className="form__row">
        <Field
          name="name"
          component={FormField}
          type="text"
          label="Full Name:"
          autoComplete="off"
          validate={[required()]}
          autoFocus
        />
      </div>
      <div className="form__row">
        <Field
          name="email"
          component={FormField}
          type="email"
          label="Email:"
          autoComplete="off"
          validate={[required(), email()]}
        />
      </div>
      <div className="form__row">
        <Field
          name="password"
          component={FormField}
          type="password"
          label="Password:"
          validate={[required(), length({ min: 8 })]}
          autoComplete="new-password"
        />
      </div>
      <div className="form__row form__row--separated">
        <div className="form__checkbox-row">
          <Field
            name="acceptedTerms"
            component={FormField}
            validate={[acceptance({ msg: 'You need to agree to our Terms & Conditions' })]}
            type="checkbox"
            label={
              <span>
                {'I accept the '}
                <a
                  href="https://www.moonassist.com/terms-and-conditions"
                  onClick={openExternalLink}
                >
                  Terms &amp; Conditions
                </a>
              </span>
            }
          />
        </div>
        <div className="form__checkbox-row">
          <Field
            name="newsletter"
            component={FormField}
            type="checkbox"
            label="Sign me up for Newsletter"
            onChange={onNewsletterChange}
            defaultChecked={newsletter}
            meta={{
              uncontrolled: true
            }}
          />
        </div>
      </div>
      <div className="form__row form__row--actions">
        <button type="submit" className="button button--block">
          Get started
        </button>
      </div>
    </form>
  );
};

export default reduxForm({
  form: 'register'
})(RegisterForm);
