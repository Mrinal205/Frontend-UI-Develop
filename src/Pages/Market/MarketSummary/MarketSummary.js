import React, { Component } from 'react';
import PropTypes from 'prop-types';

import GridBox from 'components/GridBox/GridBox';

import { getTradingPair } from '_helpers';
import { formatVolume, formatCurrency, formatUsd, formatPercentage } from '_helpers/formatting';

import './MarketSummary.scss';

const trendClass = trend => (trend ? `change-${trend}` : '');

export class MarketSummary extends Component {
  static propTypes = {
    market: PropTypes.object
  };

  shouldComponentUpdate(nextProps) {
    return nextProps.market !== this.props.market;
  }

  renderVolume() {
    const { market } = this.props;
    const { quote } = getTradingPair(market);
    const quoteVolume = formatVolume(market.volume_24h, { symbol: quote });

    return (
      <div className="MarketSummary__volume">
        Volume 24h
        <span className="MarketSummary__volume-value">{quoteVolume}</span>
      </div>
    );
  }

  renderPrices() {
    const { market } = this.props;
    const { precision = {} } = market;

    return (
      <div className="MarketSummary__trades">
        <div className="MarketSummary__trade">
          <span className="MarketSummary__trade-label">Bid</span>
          <span className={`MarketSummary__trade-value ${trendClass(market.bid_trend)}`}>
            {formatCurrency(market.bid, { precision: precision.price })}
          </span>
          <span className="MarketSummary__trade-value-usd">{formatUsd(market.bid_usd)}</span>
        </div>
        <div className="MarketSummary__trade">
          <span className="MarketSummary__trade-label">Ask</span>
          <span className={`MarketSummary__trade-value ${trendClass(market.ask_trend)}`}>
            {formatCurrency(market.ask, { precision: precision.price })}
          </span>
          <span className="MarketSummary__trade-value-usd">{formatUsd(market.ask_usd)}</span>
        </div>
        <div className="MarketSummary__trade">
          <span className="MarketSummary__trade-label">High</span>
          <span className={`MarketSummary__trade-value ${trendClass(market.high_trend)}`}>
            {formatCurrency(market.high, { precision: precision.price })}
          </span>
          <span className="MarketSummary__trade-value-usd">{formatUsd(market.high_usd)}</span>
        </div>
        <div className="MarketSummary__trade">
          <span className="MarketSummary__trade-label">Low</span>
          <span className={`MarketSummary__trade-value ${trendClass(market.low_trend)}`}>
            {formatCurrency(market.low, { precision: precision.price })}
          </span>
          <span className="MarketSummary__trade-value-usd">{formatUsd(market.low_usd)}</span>
        </div>
      </div>
    );
  }

  renderMain() {
    const { market } = this.props;
    const { precision = {} } = market;
    const price = formatCurrency(market.price, {
      precision: precision.price,
      symbol: market.quote
    });

    const priceTrend = market.change_24h > 0 ? 'up' : 'down';
    const percentageChange = formatPercentage(market.change_24h, { includeSymbol: true });
    const priceUsd = formatUsd(market.price_usd);

    return (
      <React.Fragment>
        <span className="MarketSummary__trading-pair">{market.symbol}</span>
        <div className="MarketSummary__price">
          <span className="MarketSummary__price-value">{price}</span>
          <span className={`MarketSummary__price-change ${trendClass(priceTrend)}`}>
            {percentageChange}
          </span>
        </div>
        <span className="MarketSummary__price-usd">{priceUsd}</span>
      </React.Fragment>
    );
  }

  renderContent() {
    return (
      <GridBox transparent={true}>
        <div className="MarketSummary">
          <div className="MarketSummary__main">{this.renderMain()}</div>
          <div className="MarketSummary__stats">
            {this.renderVolume()}
            {this.renderPrices()}
          </div>
        </div>
      </GridBox>
    );
  }

  renderLoading() {
    return (
      <GridBox
        transparent={true}
        loading={true}
        loadingStyle="horizontal"
        loadingMessage="Fetching Market data from the Exchange..."
      />
    );
  }

  render() {
    const { market } = this.props;
    if (market === undefined) {
      return this.renderLoading();
    }
    return this.renderContent();
  }
}

export default MarketSummary;
