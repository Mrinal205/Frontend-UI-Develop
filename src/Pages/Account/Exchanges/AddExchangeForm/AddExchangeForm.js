import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Field, reduxForm, formValueSelector } from 'redux-form';
import { required } from 'redux-form-validators';
import { Link } from 'react-router-dom';

import { FormField } from 'components/FormField';
import { Button } from 'components/Button';
import { Hint } from 'components/Hint';

import './AddExchangeForm.scss';

export class AddExchangeForm extends React.Component {
  static propTypes = {
    account: PropTypes.object,
    availableExchanges: PropTypes.array,
    handleSubmit: PropTypes.func,
    resetExchangeForm: PropTypes.func
  };

  static defaultProps = {
    availableExchanges: []
  };

  componentDidMount() {
    this.props.resetExchangeForm();
  }

  componentDidUpdate(prevProps) {
    if (this.props.exchangeNameValue !== prevProps.exchangeNameValue) {
      this.props.resetExchangeForm();
    }
  }

  getSelectProps() {
    const { availableExchanges } = this.props;
    return {
      size: 'large',
      searchable: false,
      placeholder: 'Select Exchange',
      options: availableExchanges.map(exchange => ({
        value: exchange.exchangeName,
        label: exchange.label
      })),
      valueRenderer: option => {
        // This is workaround, ReactSelect keeps rendering value instead of option.label
        const exchange = availableExchanges.find(ex => ex.exchangeName === option.value);
        return exchange ? exchange.label : option.label;
      }
    };
  }

  renderExchangeDropdown() {
    return (
      <div className="form__row">
        <div className="AddExchangeForm__select">
          <Field
            name="exchangeName"
            type="select"
            component={FormField}
            placeholder="Select Exchange"
            props={this.getSelectProps()}
            validate={[required()]}
          />
        </div>
      </div>
    );
  }

  renderCountryHint() {
    return (
      <div className="AddExchangeForm__country-hint">
        <p>
          Coinbase Pro API has limitation for trading in certain countries. <br />
          Please update country in your profile, so that we can provide you with the right
          experience.
        </p>
        <p>
          <Link to="/account/personal-data">Click here to update your address</Link>, then come back
          here to connect Coinbase Pro
        </p>
      </div>
    );
  }

  renderExchangeFields() {
    const { account, exchangeNameValue, availableExchanges } = this.props;
    const exchange = availableExchanges.find(e => e.exchangeName === exchangeNameValue);

    if (exchangeNameValue === undefined) {
      return null;
    }

    // if country is not given, we cannot add Coinbase PRO
    if (exchangeNameValue === 'GDAX' && account.address.country === '') {
      return this.renderCountryHint();
    }

    return (
      <React.Fragment>
        <div className="form__row">
          <Field
            name="apiKey"
            type="text"
            autoComplete="off"
            component={FormField}
            placeholder="Enter API Key"
            autoFocus
            validate={[required()]}
          />
        </div>
        <div className="form__row">
          <Field
            name="secret"
            type="text"
            autoComplete="off"
            component={FormField}
            placeholder="Enter API Secret key"
            validate={[required()]}
          />
        </div>

        {/* Custom field for GDAX */}
        {exchangeNameValue === 'GDAX' && (
          <div className="form__row">
            <Field
              name="additional.passphrase"
              type="text"
              autoComplete="new-password"
              component={FormField}
              placeholder="Enter API Passphrase"
              validate={[required()]}
            />
          </div>
        )}

        <div className="form__row form__row--actions">
          <Button loading={exchange && exchange.meta.connecting}>Connect</Button>
          {exchange &&
            exchange.meta.error && <Hint type="error">{exchange.meta.errorMessage}</Hint>}
        </div>
      </React.Fragment>
    );
  }

  render() {
    const { handleSubmit } = this.props;

    return (
      <div className="AddExchangeForm">
        <h3 className="AddExchangeForm__headline">Add Exchange</h3>
        <form onSubmit={handleSubmit} className="form" noValidate autoComplete="off">
          {this.renderExchangeDropdown()}
          {this.renderExchangeFields()}
        </form>
      </div>
    );
  }
}

// create Redux Form
let AddExchangeReduxForm = reduxForm({
  form: 'addExchangeForm'
})(AddExchangeForm);

// Decorate with connect to read form values
const selector = formValueSelector('addExchangeForm');
AddExchangeReduxForm = connect(state => {
  return {
    exchangeNameValue: selector(state, 'exchangeName')
  };
})(AddExchangeReduxForm);

export default AddExchangeReduxForm;
