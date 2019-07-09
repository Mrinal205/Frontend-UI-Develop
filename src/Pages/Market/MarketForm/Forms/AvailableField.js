import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { noop } from 'lodash';

import { safeNumericValue } from '_helpers';
import { formatCurrency } from '_helpers/formatting';

export class AvailableField extends Component {
  static propTypes = {
    currency: PropTypes.string,
    available: PropTypes.number,
    onClick: PropTypes.func,
    field: PropTypes.string,
    precision: PropTypes.number
  };

  static defaultProps = {
    onClick: noop,
    field: 'size'
  };

  render() {
    const { onClick, currency, available, field, precision } = this.props;
    const numAvailable = safeNumericValue(available);
    return (
      <span
        className={`MarketForm__info ${onClick !== noop ? 'MarketForm__info--clickable' : ''}`}
        onClick={onClick.bind(null, field, available)}
      >
        Available {currency}:
        <span className="MarketForm__info-value">
          {' '}
          {numAvailable === 0 ? '0' : formatCurrency(numAvailable, { precision })}
        </span>
      </span>
    );
  }
}

export default AvailableField;
