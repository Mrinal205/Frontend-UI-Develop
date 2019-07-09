import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import { ONE_DAY_TIMESTAMP, CandlesticksResolutions } from '_constants';
import Select from 'components/Select/Select';
import { changeCellRenderer } from 'components/TableList/renderers';
import CoinLineChart from 'components/CoinLineChart/CoinLineChart';
import CryptocurrencyIcon from 'components/CryptocurrencyIcon/CryptocurrencyIcon';

import { formatCurrency } from '_helpers/formatting';
import { getCurrency, getCoinInSymbol } from '_helpers';
import { getMarketUrl } from '_helpers/links';

import './TopCoinsCharts.scss';

export default class TopCoinsCharts extends Component {
  static propTypes = {
    selectedExchange: PropTypes.object,
    sortedMarkets: PropTypes.object,
    quote: PropTypes.string
  };

  handleMarketQuoteFilterChange({ value }) {
    this.props.selectTopCoinsQuote(value);
  }

  renderBox(market, i) {
    const { selectedExchange } = this.props;
    const { precision = {} } = market;

    const price = formatCurrency(market.price, {
      precision: precision.price
    });

    return (
      <div key={i} className={`TopCoinsCharts__Container-cell order-${i}`}>
        <div className="TopCoinsCharts__Container-cell-container">
          <div className="TopCoinsCharts__Container-cell-content">
            <Link
              to={getMarketUrl(selectedExchange.exchangeName, market.symbol)}
              className="TopCoinsCharts__Container-cell-name"
            >
              <CryptocurrencyIcon icon={getCoinInSymbol(market.symbol)} size={18} />
              <strong className="TopCoinsCharts__Container-cell-left-offset">
                {getCurrency(getCoinInSymbol(market.symbol))}
              </strong>
              <span className="TopCoinsCharts__Container-cell-name-symbol">
                {` | ${market.symbol}`}
              </span>
            </Link>
            <div className="TopCoinsCharts__Container-cell-price">
              {price}
              <span className="TopCoinsCharts__Container-cell-change">
                {changeCellRenderer({ value: market.change_24h })}
              </span>
            </div>
          </div>
          <CoinLineChart
            exchangeName={selectedExchange.exchangeName}
            symbol={market.symbol}
            resolution={CandlesticksResolutions['5m']}
            lookback={ONE_DAY_TIMESTAMP}
          />
        </div>
      </div>
    );
  }

  render() {
    const { selectedExchange, coins, quotes, selections } = this.props;

    return (
      <div className="TopCoinsCharts">
        <div className="TopCoinsCharts__Header">
          <div className="TopCoinsCharts__Header-selectors">
            <Select
              value={selections.quote}
              options={quotes}
              onChange={this.handleMarketQuoteFilterChange.bind(this)}
              clearable={false}
              removeSelected={true}
              searchable={false}
            />
          </div>
          <div className="TopCoinsCharts__Header-title">
            Top 4 coins on {selectedExchange.label} (24H volume)
          </div>
        </div>
        <div className="TopCoinsCharts__Container">
          {coins.map((market, i) => this.renderBox(market, i))}
        </div>
      </div>
    );
  }
}
