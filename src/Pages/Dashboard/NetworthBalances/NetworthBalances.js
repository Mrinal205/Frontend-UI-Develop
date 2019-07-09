import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import moment from 'moment';

import { Col, Row } from 'components/GridSystem/GridSystem';
import GridBox from 'components/GridBox/GridBox';
import { formatUsd, formatPercentage, formatCurrency } from '_helpers/formatting';

import './NetworthBalances.scss';

const NetworthBalance = ({ label, change, percentageChange, btcValue, usdValue }) => {
  return (
    <Col size="3">
      <div className="NetworthBalance">
        <div className="NetworthBalance__headline">
          <strong className="NetworthBalance__label">{label}</strong>
          <span className={`NetworthBalance__change NetworthBalance__change--${change}`}>
            {percentageChange}
          </span>
        </div>
        <div className="NetworthBalance__values">
          <span className="NetworthBalance__value-primary">{usdValue}</span>
          <span className="NetworthBalance__value-secondary">{btcValue}</span>
        </div>
      </div>
    </Col>
  );
};

const TotalBalance = ({ label, usdValue, btcValue }) => {
  return (
    <Col size="3">
      <div className="Balance__Title">
        <div className="Balance__Title--label">{label}</div>
        <span className="Balance__Title--primary">{usdValue}</span>
        <span className="Balance__Title--secondary">{btcValue}</span>
      </div>
    </Col>
  );
};

export default class NetworthBalances extends Component {
  static propTypes = {
    markets: PropTypes.object,
    networth: PropTypes.object
  };

  /**
   * Calculates 24h change of balance from datapoints.
   * Array order from latest to oldest (last item)
   */
  getLast24hNetworthBalance() {
    const { networth } = this.props;

    let value = 0;
    let change = 0;

    let dayChange = true;

    // need at least one day worth of data
    if (networth.usd && networth.usd.length > 1) {
      const firstDatapoint = moment()
        .subtract(24, 'hours')
        .valueOf();
      const latestValue = networth.usd[0];
      let prevDayValue = networth.usd.find(item => item.date < firstDatapoint);

      // if the value from day before (-24h) is not available, use just last 15 minutes (1 data point)
      if (prevDayValue === undefined) {
        prevDayValue = networth.usd[1];
        dayChange = false;
      }

      value = latestValue.value - prevDayValue.value;
      change = (value / prevDayValue.value) * 100;
    }

    const btcValue = this.getBtcValueFromUsd(value);

    return {
      usdValue: formatUsd(value),
      btcValue: btcValue !== 0 ? formatCurrency(btcValue, { symbol: 'BTC' }) : '',
      change: change > 0 ? 'up' : change < 0 ? 'down' : '',
      percentageChange: formatPercentage(change),
      dayChange
    };
  }

  /**
   * Calculates 24h change of balance from datapoints.
   * Array order from latest to oldest (last item)
   */
  getAllTimeNetworthBalance() {
    const { networth } = this.props;

    let value = 0;
    let change = 0;

    if (networth.usd && networth.usd.length > 1) {
      const latestValue = networth.usd[0];
      const oldestValue = networth.usd[networth.usd.length - 1];

      value = latestValue.value - oldestValue.value;
      change = (value / oldestValue.value) * 100;
    }

    const btcValue = this.getBtcValueFromUsd(value);

    return {
      usdValue: formatUsd(value),
      btcValue: btcValue !== 0 ? formatCurrency(btcValue, { symbol: 'BTC' }) : '',
      change: change > 0 ? 'up' : change < 0 ? 'down' : '',
      percentageChange: formatPercentage(change)
    };
  }

  /*
   * Gets total wallet balance from datapoints
   * Just first element in array
   */
  getTotalBalance() {
    const { networth } = this.props;
    return {
      usdValue: formatUsd(networth.base.usd),
      btcValue: formatCurrency(networth.base.btc, { symbol: 'BTC' })
    };
  }

  /**
   * Calculates BTC value
   * WARNING! This is only temporary "quick-fix" for missing BTC values
   *
   * @param {float} usdValue
   */
  getBtcValueFromUsd(usdValue) {
    const { markets } = this.props;
    let btcRate;

    try {
      if (markets.BINANCE) {
        btcRate = markets.BINANCE.list['BTC/USDT'].price;
      } else if (markets.BITTREX) {
        btcRate = markets.BITTREX.list['BTC/USD'].price;
      } else if (markets.GDAX) {
        btcRate = markets.GDAX.list['BTC/USD'].price;
      }

      if (btcRate) {
        return usdValue * (1 / btcRate);
      } else {
        return 0;
      }
    } catch (err) {
      return 0;
    }
  }

  renderLoading() {
    return (
      <div className="NetworthBalances NetworthBalances--loading">
        <GridBox transparent loading />
      </div>
    );
  }

  render() {
    const { networth } = this.props;

    if (networth.meta.loading) {
      return this.renderLoading();
    }

    const last24hBalance = this.getLast24hNetworthBalance();
    const allTimeBalance = this.getAllTimeNetworthBalance();

    const totalBalance = this.getTotalBalance();

    return (
      <div className="NetworthBalances">
        <Row>
          <TotalBalance label="Total Wallet Balance" {...totalBalance} />
          <NetworthBalance
            label={last24hBalance.dayChange ? 'Last 24h change' : 'Last change'}
            {...last24hBalance}
          />
          <NetworthBalance label="All time change" {...allTimeBalance} />
          <Col size="3">
            <div className="NetworthBalances__aside">
              <Link to="/wallet" className="NetworthBalances__wallet-link">
                <i className="NetworthBalances__wallet-icon" />
              </Link>
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}
