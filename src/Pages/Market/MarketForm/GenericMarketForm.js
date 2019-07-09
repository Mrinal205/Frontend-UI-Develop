import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';

import NumberInput from 'components/NumberInput/NumberInput';
import { Col } from 'components/GridSystem/GridSystem';
import Select from 'components/Select/Select';
import Button from 'components/Button/Button';
import StepSelector from 'components/StepSelector/StepSelector';
import ToggleSwitch from 'components/ToggleSwitch/ToggleSwitch';
import TotalFields from './Forms/TotalFields';
import AvailableField from './Forms/AvailableField';

import { OrderValidations } from '_helpers/orders';

import { BigNumber } from 'bignumber.js';

import { OfferTypes } from '_constants';

import './MarketForm.scss';

export class GenericMarketForm extends Component {
  static propTypes = {
    offerType: PropTypes.string.isRequired,
    orderType: PropTypes.string.isRequired,
    selectedMarket: PropTypes.object.isRequired,
    selectedExchange: PropTypes.object.isRequired,
    orderbook: PropTypes.object,
    balance: PropTypes.object,
    fields: PropTypes.array.isRequired,
    submitOrder: PropTypes.func.isRequired,
    form: PropTypes.string,
    formData: PropTypes.object,
    markets: PropTypes.object
  };

  static defaultProps = {
    formData: {}
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.initializeValues();
  }

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.orderType !== this.props.orderType ||
      nextProps.selectedMarket.symbol !== this.props.selectedMarket.symbol ||
      nextProps.selectedExchange.exchangeName !== this.props.selectedExchange.exchangeName
    ) {
      this.setFocus(null);
      this.initializeValues(nextProps);
    }
  }

  initializeValues(props) {
    const { initialValues, form, initializeOrderValues } = props || this.props;
    initializeOrderValues({ form, values: initialValues });
  }

  validateField(validations, field, formData, limits) {
    if (limits !== undefined) {
      if (Array.isArray(validations[field])) {
        for (let i = 0; i < validations[field].length; i++) {
          let error = validations[field][i](formData, field, limits);
          if (error) {
            return error;
          }
        }
        return null;
      } else {
        return validations[field](formData, field, limits);
      }
    }
    return null;
  }

  prepareOrder() {
    const {
      selectedExchange,
      selectedMarket,
      selectedMarketLimits,
      form,
      formData,
      submitOrder,
      offerType,
      orderType,
      validations,
      rejectOrder,
      sendFields
    } = this.props;

    for (let field of Object.keys(validations)) {
      const error = this.validateField(validations, field, formData, selectedMarketLimits);
      if (error) {
        rejectOrder({ error, form });
        return;
      }
    }

    // Prepare order with common fields
    let order = {
      symbolPair: selectedMarket.symbol,
      offerType: offerType.toUpperCase(),
      orderType: orderType.toUpperCase(),
      exchangeName: selectedExchange.exchangeName.toUpperCase()
    };

    // add optional fields for each type of form
    Object.keys(sendFields).forEach(key => {
      order[key] = formData[sendFields[key]];
    });

    // adjust order to include fees
    order = this.adjustOrderFees(order, form, formData.total, formData.price);
    //validate total
    const totalError = this.validateField(
      { cost: OrderValidations.requiredGreaterThan },
      'cost',
      { cost: order.amount * order.price },
      selectedMarketLimits
    );
    if (totalError) {
      rejectOrder({ error: totalError, form });
      return;
    }

    // submit order
    submitOrder({ order, form });
  }

  adjustOrderFees(order, form, orderTotal, marketPrice) {
    const {
      selectedMarket: { taker, maker, precision }
    } = this.props;

    // get highest fee (as we dont know if order is maker or taker)
    const marketFee = taker > maker ? taker : maker;

    // if the form is on "sell", no marketFee was provided, do nothing
    if (form.indexOf('sell') > -1 || marketFee === undefined || marketFee <= 0) {
      return order;
    }

    // calculate fee from order total
    const orderFee = BigNumber(orderTotal).multipliedBy(marketFee);

    // calculate by how much we need to decrease order size to (use order price or market price)
    const deductedAmount = order.price
      ? orderFee.dividedBy(order.price)
      : orderFee.dividedBy(marketPrice);

    // get new order amount
    const newAmount = BigNumber(order.amount).minus(deductedAmount);

    // update order
    const updatedOrder = {
      ...order,
      amount: newAmount.toFixed(precision.amount),
      originalAmount: order.amount
    };

    return updatedOrder;
  }

  setFocus(name) {
    this.setState({ focus: name });
  }

  onChange(field, value) {
    value = value.target ? value.target.value : value;
    const {
      changeOrderValue,
      form,
      attachToAction,
      orderbook: { precision },
      selectedExchange: { exchangeName }
    } = this.props;
    changeOrderValue({
      ...attachToAction,
      form,
      field,
      value: value.toFixed ? value.toFixed(precision.price) : value,
      exchangeName,
      precision: precision.amount
    });
  }

  getMarketInputOptions(options) {
    const { offerType } = this.props;

    // if we're passing a react object
    if (typeof options.component === 'object' || options.component === 'input') {
      return options;
    }

    if (options.component === 'select') {
      options = {
        ...options,
        placeholder: options.placeholder || `Select ${options.name}`,
        removeSelected: false,
        searchable: false,
        clearable: false,
        component: Select
      };
    } else if (options.component === 'switch') {
      options = {
        ...options,
        component: ToggleSwitch,
        offerType
      };
    } else {
      const { symbol } = this.props.selectedMarket;
      const { precision } = this.props.markets[symbol];
      const placeholder = precision.amount > 0 ? '0.' + '0'.repeat(precision.amount) : '0';
      const step = precision.price > 0 ? 1 / Math.pow(10, precision.price) : 1;

      options = {
        ...options,
        type: 'number',
        placeholder,
        precision: options.label === 'price' ? precision.price : precision.amount,
        min: 0,
        step,
        autoComplete: 'off',
        component: NumberInput
      };
    }

    // slider options must not be passed down to the inputs
    delete options.slider;

    return {
      ...options,
      input: {
        onFocus: this.setFocus.bind(this, options.name),
        onChange: this.onChange.bind(this, options.name),
        value: this.props.formData[options.name] || ''
      }
    };
  }

  render() {
    const {
      selectedMarket,
      selectedMarket: { base, quote, precision },
      selectedMarketLimits,
      offerType,
      fields,
      balance,
      formData,
      formData: { orderSubmitting, orderError },
      selectedExchange
    } = this.props;

    const isBuyForm = offerType === OfferTypes.BUY;
    const currency = isBuyForm ? quote : base;
    const availableAmount = get(balance, [selectedExchange.exchangeName, currency, 'available'], 0);

    return (
      <Col size="6" noMargin>
        <div className={`MarketForm MarketForm--${offerType}`}>
          <div className="MarketForm__header">
            <h2 className="MarketForm__title">{`${offerType} ${base}`}</h2>
            <AvailableField
              selectedMarket={selectedMarket}
              currency={currency}
              available={availableAmount}
              precision={isBuyForm ? precision.base : precision.amount}
              onClick={this.onChange.bind(this, 'sizePercentage', 100)}
              field={isBuyForm ? 'total' : 'size'}
            />
          </div>
          {fields.map(field => {
            const {
              conditionalOfferType,
              component: InputComponent,
              ...options
            } = this.getMarketInputOptions(field);

            // exclude component which offertype doesn't match
            if (conditionalOfferType && conditionalOfferType !== offerType) {
              return <span key={field.label} />;
            }

            return (
              <React.Fragment key={field.label}>
                <div
                  className={`MarketForm__row ${
                    field.label === 'size' ? 'MarketForm__row--with-hint' : ''
                  }`}
                >
                  <div className="MarketForm__field">
                    {typeof InputComponent === 'function' ? (
                      <InputComponent floatingLabel {...options} />
                    ) : (
                      InputComponent
                    )}
                  </div>
                  {field.label === 'size' &&
                  selectedMarketLimits &&
                  selectedMarketLimits.amount &&
                  selectedMarketLimits.amount.min ? (
                    <div className="MarketForm__field MarketForm__field--hint">
                      {`Minimum size: ${selectedMarketLimits.amount.min} `}
                    </div>
                  ) : (
                    ''
                  )}
                </div>
                {field.slider && (
                  <div className="MarketForm__row MarketForm__row--sub-row">
                    <div className="MarketForm__field">
                      <StepSelector
                        name={`${field.name}Percentage`}
                        formType={offerType}
                        showInput={false}
                        input={{
                          value: formData[`${field.name}Percentage`] || 0,
                          onChange: this.onChange.bind(this, `${field.name}Percentage`)
                        }}
                      />
                    </div>
                  </div>
                )}
              </React.Fragment>
            );
          })}

          <div className="MarketForm__pull-bottom">
            <TotalFields {...this.props} />
            <div className="MarketForm__action">
              <Button
                block
                className={`MarketForm__submit MarketForm__submit--${offerType}`}
                onClick={this.prepareOrder.bind(this)}
                disabled={orderSubmitting}
                loading={orderSubmitting}
              >
                {offerType}
              </Button>
            </div>
          </div>
          {orderError && <div className="MarketForm__error-message">{orderError}</div>}
        </div>
      </Col>
    );
  }
}

export default GenericMarketForm;
