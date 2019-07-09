import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { getTradingPair } from '_helpers';
import { formatCurrency } from '_helpers/formatting';

export class MarketPrice extends Component {
  static propTypes = {
    market: PropTypes.object,
    trades: PropTypes.array
  };

  renderContent() {
    const { market } = this.props;
    const { precision = {} } = market;
    const price = formatCurrency(market.price, {
      precision: precision.price,
      symbol: market.quote
    });

    const priceTrend = market.change_24h > 0 ? 'change-up' : 'change-down';

    return (
      <React.Fragment>
        <span className="MarketPrice__price-value">{price}</span>
        <span className={`MarketSummary__price-change ${priceTrend}`} />
      </React.Fragment>
    );
  }

  render() {
    const { market } = this.props;
    const { quote } = getTradingPair(market);

    return (
      <div className="MarketPrice">
        <span className="MarketPrice__trading-pair">Last price {quote}</span>
        {this.renderContent()}
      </div>
    );
  }
}

export default MarketPrice;
