import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Dashboard from './Dashboard';

import { paginatedOrders } from '_selectors/orders';
import { consolidatedValueBalance } from '_selectors/balance';
import { getExchangeByName, getConnectedExchanges } from '_selectors/exchanges';

import { fetchMarkets } from '_actions/markets.actions';
import { fetchMarketcapOverview } from '_actions/marketcap.actions';
import { fetchExchangeOrders, cancelOrder, selectOrdersPage } from '_actions/orders.actions';
import {
  fetchExchangeBalance,
  fetchHistoricalNetworth,
  fetchBaseNetworth
} from '_actions/balance.actions';

import { AllExchangesData } from '_constants';

class DashboardContainer extends Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
    selectedExchange: PropTypes.object.isRequired,
    selectedMarket: PropTypes.object,
    orders: PropTypes.object
  };

  componentDidMount() {
    this.getData();
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.selectedExchange !== nextProps.selectedExchange) {
      this.getData(nextProps);
    }
  }

  getData(props) {
    const { exchanges } = props || this.props;

    exchanges.forEach(exchange => {
      if (exchange.id) {
        this.props.fetchExchangeOrders(exchange.exchangeName);
        this.props.fetchExchangeBalance(exchange.exchangeName);
        this.props.fetchMarkets(exchange.exchangeName);
      }
    });

    this.props.fetchMarketcapOverview({ convert: 'BTC' });
    this.props.fetchHistoricalNetworth();
    this.props.fetchBaseNetworth();
  }

  render() {
    return <Dashboard {...this.props} />;
  }
}

const mapStateToProps = (state, ownProps) => {
  const { exchangeName } = ownProps.match.params;
  const selectedExchange = exchangeName ? getExchangeByName(state, exchangeName) : AllExchangesData;
  const { orders } = state;

  return {
    selectedExchange,
    orders,
    exchanges: getConnectedExchanges(state),
    history: ownProps.history,
    marketcap: state.marketcap,
    markets: state.markets,
    networth: state.networth,
    ...consolidatedValueBalance(state, selectedExchange),
    ...paginatedOrders(state, selectedExchange)
  };
};

const mapDispatchToProps = {
  fetchExchangeOrders,
  fetchExchangeBalance,
  fetchMarkets,
  fetchMarketcapOverview,
  fetchHistoricalNetworth,
  fetchBaseNetworth,
  cancelOrder,
  selectOrdersPage
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DashboardContainer);
