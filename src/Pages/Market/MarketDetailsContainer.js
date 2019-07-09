import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import MarketDetails from './MarketDetails';

import { getExchangeByName, connectedToExchange } from '_selectors/exchanges';
import { getMarketByName } from '_selectors/markets';
import { getMarketLimits } from '_selectors/marketInfo';
import { paginatedOrdersByMarket } from '_selectors/orders';

import { selectOrdersPage } from '_actions/orders.actions';
import { fetchMarkets, subscribeMarket, unsubscribeMarket } from '_actions/markets.actions';
import { fetchMarketInfo } from '_actions/marketInfo.actions';
import { fetchOrderBook } from '_actions/orderbook.actions';
import { fetchTrades } from '_actions/trades.actions';
import {
  setCurrentTradingMarket,
  fetchOrders,
  stopFetchOrders,
  cancelOrder
} from '_actions/orders.actions';
import { fetchBalance } from '_actions/balance.actions';

class MarketDetailsContainer extends Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
    selectedExchange: PropTypes.object.isRequired,
    selectedMarket: PropTypes.object,
    orders: PropTypes.object,
    isConnected: PropTypes.bool
  };

  componentDidMount() {
    this.getMarketAndExchangeData();
  }

  componentDidUpdate(oldProps) {
    if (this.marketOrExchangeChanged(oldProps)) {
      this.getMarketAndExchangeData();
    }
  }

  componentWillUnmount() {
    this.props.unsubscribeMarket();
    this.props.stopFetchOrders();
  }

  getMarketAndExchangeData() {
    const { selectedExchange, selectedMarket } = this.props;

    if (selectedExchange) {
      if (selectedMarket === undefined) {
        this.props.fetchExchangeData(selectedExchange.exchangeName);
      } else {
        const { base, quote } = selectedMarket;
        this.props.fetchMarketData(selectedExchange.exchangeName, selectedMarket.symbol);
        this.props.fetchMarketInfo(selectedExchange.exchangeName, selectedMarket.symbol);
        this.props.setCurrentTradingMarket({ selectedMarket, base, quote });

        if (this.props.isConnected) {
          this.props.fetchBalance(selectedExchange.exchangeName, [base, quote]);
          this.props.fetchOrders(selectedExchange.exchangeName, selectedMarket.symbol);
        }
      }
    }
  }

  /**
   * Checks if market changed (components needs updating)
   * @param {Object} oldProps
   */
  marketOrExchangeChanged(oldProps) {
    const { selectedExchange, selectedMarket } = this.props;
    if (!selectedMarket || !selectedMarket) {
      return false;
    }
    const exchangeChanged = selectedExchange !== oldProps.selectedExchange;
    const marketChanged =
      (selectedMarket && oldProps.selectedMarket === undefined) ||
      selectedMarket.symbol !== oldProps.selectedMarket.symbol;

    return exchangeChanged || marketChanged;
  }

  render() {
    // TODO: Redirect to 404 when Market not found
    return <MarketDetails {...this.props} />;
  }
}

const mapStateToProps = (state, ownProps) => {
  const { exchangeName, marketName: marketNameURL } = ownProps.match.params;
  const marketName = marketNameURL.replace('-', '/');
  const selectedExchange = getExchangeByName(state, exchangeName);
  const selectedMarket = getMarketByName(state, marketName, exchangeName);
  const selectedMarketLimits = getMarketLimits(state, exchangeName, marketName);
  const userIsConnected = connectedToExchange(state, exchangeName);

  return {
    selectedExchange,
    selectedMarketLimits,
    selectedMarket,
    trades: state.trades,
    orders: state.orders,
    isConnected: userIsConnected,
    ...paginatedOrdersByMarket(state, selectedExchange, marketName)
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setCurrentTradingMarket: (...params) => {
      dispatch(setCurrentTradingMarket(...params));
    },
    fetchBalance: (...params) => {
      dispatch(fetchBalance(...params));
    },
    fetchOrders: (...params) => {
      dispatch(fetchOrders(...params));
    },
    selectOrdersPage: (...params) => {
      dispatch(selectOrdersPage(...params));
    },
    cancelOrder: (...params) => {
      dispatch(cancelOrder(...params));
    },
    stopFetchOrders: (...params) => {
      dispatch(stopFetchOrders(...params));
    },
    fetchExchangeData: exchangeName => {
      dispatch(fetchMarkets(exchangeName));
    },
    fetchMarketInfo: (exchangeName, symbol) => {
      dispatch(fetchMarketInfo(exchangeName, symbol));
    },
    fetchMarketData: (exchangeName, marketSymbol) => {
      dispatch(fetchOrderBook(exchangeName, marketSymbol));
      dispatch(fetchTrades(exchangeName, marketSymbol));
      dispatch(subscribeMarket(exchangeName, marketSymbol));
    },
    unsubscribeMarket: () => {
      dispatch(unsubscribeMarket());
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MarketDetailsContainer);
