import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { get } from 'lodash';

import { Row } from 'components/GridSystem/GridSystem';
import GenericMarketForm from './GenericMarketForm';
import MarketFormPlaceholder from './MarketFormPlaceholder';
import GridBox from 'components/GridBox/GridBox';

import { getCurrency, getTradingPair, safeNumericValue } from '_helpers';
import { OrderValidations } from '_helpers/orders';
import { formatCurrency } from '_helpers/formatting';
import { isCoinbaseAllowedMarket } from '_helpers/countryRestrictions';

import {
  OfferTypes,
  OrderTypes,
  getFormId,
  SignalBuyTypes,
  OrderTypesTabs,
  SignalBuyDurationTypes
} from '_constants';

import './AdvancedMarketForm.scss';

export class AdvancedMarketForm extends Component {
  static propTypes = {
    account: PropTypes.object,
    orderbook: PropTypes.object,
    selectedExchange: PropTypes.object,
    selectedMarket: PropTypes.object,
    selectedMarketLimits: PropTypes.object,
    balance: PropTypes.object,
    onSubmit: PropTypes.func,
    initializeOrderValues: PropTypes.func,
    changeOrderValue: PropTypes.func
  };

  constructor(props) {
    super(props);
    this.state = {
      orderType: OrderTypesTabs[0]
    };
  }

  shouldComponentUpdate(nextProps) {
    return (
      nextProps.balance !== this.props.balance ||
      nextProps.forms !== this.props.forms ||
      (this.state.orderType === OrderTypes.MARKET &&
        nextProps.orderbook !== this.props.orderbook) ||
      (this.state.orderType === OrderTypes.CONVERT && nextProps.markets !== this.props.markets)
    );
  }

  isTradingAllowed() {
    const { account, selectedExchange, selectedMarket } = this.props;
    const { quote } = getTradingPair(selectedMarket);

    let isAllowed = true;

    // for GDAX we need to make custom check
    if (selectedExchange.exchangeName === 'GDAX') {
      isAllowed = isCoinbaseAllowedMarket(account.address.country, quote);
    }

    return isAllowed;
  }

  selectOrderType(orderType) {
    this.setState({ orderType }, () => this.forceUpdate());
  }

  prepareCoinOptions() {
    const {
      markets,
      selectedExchange: { coins },
      base
    } = this.props;
    return coins.map(coin => {
      // TODO: we fallback to 1, assuming that BTC/BTC will be missing
      // TODO: we must abstract this into a function, and make it more safe
      const price = (markets[`${coin.base}/BTC`] || {}).price || 1;
      const basePrice = (markets[`${base}/BTC`] || {}).price || 1;
      return {
        value: { value: coin, price, basePrice },
        label: (
          <div className="Select-option-container">
            <span className="Select-option-coin">{coin}</span>
            <span className="Select-option-currency">{getCurrency(coin)}</span>
            <span className="Select-option-price">{price} BTC</span>
          </div>
        )
      };
    });
  }

  renderOrderForms() {
    const { orderType } = this.state;
    const {
      forms,
      balance,
      selectedMarket,
      selectedMarket: { base, quote, precision },
      submitOrder,
      rejectOrder,
      selectedExchange,
      selectedMarketLimits,
      orderbook,
      initializeOrderValues,
      changeOrderValue
    } = this.props;

    let fields;
    let initialValues = {};
    let validations = {};
    let sendFields = {};

    // Placeholder is here to prevent crash from switch convert logic
    if (
      orderType === OrderTypes.CONVERT ||
      orderType === OrderTypes.STOP ||
      orderType === OrderTypes.SIGNAL
    ) {
      return (
        <Row noMargin className="AdvancedMarketForm--holder">
          <MarketFormPlaceholder>
            <p className="AdvancedMarketForm--coming-soon">Trading Feature Coming Soon</p>
          </MarketFormPlaceholder>
        </Row>
      );
    }

    if (this.isTradingAllowed() === false) {
      return (
        <Row noMargin className="AdvancedMarketForm--holder">
          <MarketFormPlaceholder>
            <p className="AdvancedMarketForm--error">
              We're sorry but selected trading pair is not available for trading on your Coinbase
              Pro account.
            </p>
          </MarketFormPlaceholder>
        </Row>
      );
    }

    switch (orderType) {
      case OrderTypes.MARKET:
        fields = [
          {
            label: 'price',
            name: 'price',
            spinButton: true,
            unit: quote,
            disabled: true,
            value: 'Best Price'
          },
          {
            label: 'size',
            name: 'size',
            slider: true,
            unit: base,
            precision: precision.amount
          }
        ];
        initialValues = { size: 0, sizePercentage: 0, total: 0, precision: precision.amount };
        validations = {
          size: OrderValidations.requiredNotZero
        };
        sendFields = {
          amount: 'size'
        };
        break;

      case OrderTypes.STOP:
        fields = [
          { label: 'stop', name: 'stop', spinButton: true, unit: quote },
          { label: 'size', name: 'size', slider: true, unit: base },
          {
            label: 'Trailing Stop',
            name: 'trailing',
            component: 'switch',
            description: 'What is traling stop',
            conditionalOfferType: OfferTypes.SELL
          }
        ];
        initialValues = { stop: selectedMarket.price, size: 0, sizePercentage: 0, total: 0 };
        break;

      case OrderTypes.SIGNAL:
        fields = [
          { label: 'spend size', name: 'size', slider: true, unit: base },
          {
            label: 'signal',
            name: 'signalType',
            component: 'select',
            placeholder: 'Select signal',
            options: Object.values(SignalBuyTypes)
          },
          { label: 'time', name: 'duration', component: 'select', options: SignalBuyDurationTypes }
        ];
        initialValues = { size: 0, sizePercentage: 0, total: 0 };
        break;

      case OrderTypes.CONVERT:
        fields = [
          { label: 'size', name: 'size', slider: true, unit: base },
          {
            label: 'time',
            name: 'coin',
            component: 'select',
            options: this.prepareCoinOptions(),
            className: 'Select--moon-coins'
          }
        ];
        initialValues = { size: 0, sizePercentage: 0, total: 0 };
        break;

      case OrderTypes.LIMIT:
      default:
        fields = [
          { label: 'price', name: 'price', spinButton: true, unit: quote },
          { label: 'size', name: 'size', slider: true, unit: base, precision: precision.amount }
        ];
        initialValues = {
          price: selectedMarket.price,
          size: 0,
          sizePercentage: 0,
          total: 0
        };
        validations = {
          price: OrderValidations.requiredNotZero,
          size: OrderValidations.requiredNotZero
        };
        sendFields = {
          amount: 'size',
          price: 'price'
        };
        break;
    }

    const offerTypes =
      orderType === OrderTypes.CONVERT ? [OfferTypes.CONVERT] : [OfferTypes.BUY, OfferTypes.SELL];

    return (
      <Row noMargin className="AdvancedMarketForm--holder">
        {offerTypes.map(offerType => {
          const formKey = getFormId(offerType, orderType);
          const formData = { ...(forms[formKey] || {}) };
          const availableCoin = offerType === OfferTypes.BUY ? quote : base;

          // MARKET orders only
          let totalValue = null;
          let attachToAction = null;
          if (orderType === OrderTypes.MARKET) {
            // asks need revers order (to take last)
            const orderbookSource =
              offerType === OfferTypes.BUY ? [...orderbook.asks].reverse() : orderbook.bids;

            const bestMarketPrice = get(orderbookSource, '0.0', 0);
            const formattedMarketPrice = formatCurrency(bestMarketPrice, {
              precision: selectedMarket.precision.price
            });

            fields = [
              {
                ...fields[0],
                component: (
                  <div className="MarketForm__input">
                    <span className="MarketForm__input-placeholder">Market Price </span>
                    <span>~{formattedMarketPrice}</span>
                    <span className="MarketForm__field-unit">{fields[0].unit}</span>
                  </div>
                )
              },
              fields[1]
            ];
            totalValue = safeNumericValue(bestMarketPrice) * safeNumericValue(formData.size);
            attachToAction = { bestMarketPrice };
          }

          return (
            <GenericMarketForm
              initialValues={{
                ...initialValues,
                availableCoin
              }}
              validations={validations}
              sendFields={sendFields}
              orderbook={orderbook}
              key={offerType}
              offerType={offerType}
              orderType={orderType}
              initializeOrderValues={initializeOrderValues}
              changeOrderValue={changeOrderValue}
              selectedMarket={selectedMarket}
              selectedExchange={selectedExchange}
              selectedMarketLimits={selectedMarketLimits}
              balance={balance}
              fields={fields}
              rejectOrder={rejectOrder}
              submitOrder={submitOrder}
              form={formKey}
              formData={formData}
              totalValue={totalValue}
              attachToAction={attachToAction}
              markets={this.props.markets}
            />
          );
        })}
      </Row>
    );
  }

  render() {
    const { orderType } = this.state;
    return (
      <GridBox name="AdvancedMarketForm">
        <div className="AdvancedMarketForm__Tabs">
          <span className="AdvancedMarketForm__Tabs--title">Place Order</span>
          <ul className="AdvancedMarketForm__Tabs--options">
            {OrderTypesTabs.map(option => (
              <li
                key={option}
                className={classnames('AdvancedMarketForm__Tabs--option', {
                  selected: option === orderType
                })}
                onClick={this.selectOrderType.bind(this, option)}
              >
                {option}
              </li>
            ))}
          </ul>
        </div>
        {this.renderOrderForms()}
      </GridBox>
    );
  }
}

export default AdvancedMarketForm;
