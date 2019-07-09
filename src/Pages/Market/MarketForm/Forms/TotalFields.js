import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { getFeeForExchange } from '_helpers/orders';
import { safeNumericValue } from '_helpers';
import { formatCurrency } from '_helpers/formatting';

export class TotalFields extends Component {
  static propTypes = {
    quote: PropTypes.string,
    form: PropTypes.string.isRequired,
    selectedExchange: PropTypes.object,
    formData: PropTypes.object
  };

  static defaultProps = {
    formData: {
      values: {}
    },
    includeInput: true
  };

  render() {
    const {
      selectedMarket: { quote, precision },
      selectedExchange,
      formData: { total, coin },
      totalValue
    } = this.props;

    return (
      <React.Fragment>
        <div className="MarketForm__total">
          <span className="MarketForm__total-label">Total</span>
          <span className="MarketForm__total-value">
            {formatCurrency(safeNumericValue(totalValue !== null ? totalValue : total), {
              precision: precision.price,
              symbol: coin || quote
            })}
          </span>
        </div>
        <div className="MarketForm__fee">
          <span className="MarketForm__fee-label">Exchange Trading Fee</span>
          <span className="MarketForm__fee-value">{getFeeForExchange(selectedExchange)}</span>
        </div>
      </React.Fragment>
    );
  }
}

export default TotalFields;
