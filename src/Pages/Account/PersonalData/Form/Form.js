import React from 'react';
import { Field, FormSection, reduxForm } from 'redux-form';
import { required, date } from 'redux-form-validators';

import { FormField } from 'components/FormField';
import { Button } from 'components/Button';
import { Hint } from 'components/Hint';
import countryList from 'Pages/Account/PersonalData/Form/countries.json';

import './Form.scss';

// Personal details form fragment
const PersonalDatails = () => (
  <React.Fragment>
    <div className="form__row">
      <Field
        name="name"
        component={FormField}
        type="text"
        label="Full name:"
        placeholder=""
        required
        validate={[required()]}
        autoFocus
      />
    </div>

    <div className="form__flex-row">
      <div className="form__col">
        <Field
          name="dateOfBirth"
          component={FormField}
          type="date"
          label="Date of birth:"
          placeholder=""
          validate={[
            date({
              format: 'yyyy-mm-dd',
              msg: 'Please give date in a format of YYYY-MM-DD',
              allowBlank: true
            })
          ]}
        />
      </div>
      <div className="form__col">
        <Field
          name="phone"
          component={FormField}
          type="phone"
          label="Phone number:"
          placeholder=""
        />
      </div>
    </div>
  </React.Fragment>
);

// Country Select
export const CountrySelectOptions = () => {
  const defaultOption = (
    <option key={'default--country-select'} value="">
      -- Select One --
    </option>
  );

  const countryOptions = countryList.map(country => (
    <option key={country.name} value={country.name}>
      {country.name}
    </option>
  ));

  return [defaultOption, ...countryOptions];
};

// Address form fragment
const Address = () => (
  <React.Fragment>
    <div className="form__row">
      <Field name="line1" component={FormField} type="text" label="Street address:" />
    </div>

    <div className="form__row">
      <Field name="line2" component={FormField} type="text" label="Address extra:" />
    </div>

    <div className="form__flex-row">
      <div className="form__col">
        <Field name="city" component={FormField} type="text" label="City:" />
      </div>
      <div className="form__col">
        <Field name="postal" component={FormField} type="text" label="Postal code:" />
      </div>
    </div>

    <div className="form__flex-row">
      <div className="form__col">
        <Field name="province" component={FormField} type="text" label="Province / State:" />
      </div>
      <div className="form__col">
        <label htmlFor="country" className="form__label">
          Country:
        </label>
        <Field name="country" component="select" className="Account__country">
          <CountrySelectOptions />
        </Field>
      </div>
    </div>
  </React.Fragment>
);

export const Form = ({ handleSubmit, account }) => (
  <form onSubmit={handleSubmit} className="form" noValidate>
    <FormSection name="personalDetails">
      <PersonalDatails />
    </FormSection>

    <FormSection name="address">
      <Address />
    </FormSection>

    <div className="form__row form__row--info">
      <Hint type="info">Fields marked with * are mandatory</Hint>
    </div>

    <div className="form__flex-row form__row--actions">
      <div className="form__col">
        <Button block loading={account.meta.updating}>
          Update your data
        </Button>
        {account.meta.updated && <Hint type="success">Your data has been saved successfully.</Hint>}
        {account.meta.error && <Hint type="error">{account.meta.errorMessage}</Hint>}
      </div>
      <div className="form__col" />
    </div>
  </form>
);

export default reduxForm({ form: 'personalData' })(Form);
