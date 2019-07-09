import React, { Component } from 'react';
import { connect } from 'react-redux';

import MarketOverview from './MarketOverview';

import {
  getMarketsByExchange,
  getMarketQuotes,
  getSortedMarketsByPairQuote,
  getTopCoinsByVolume
} from '_selectors/markets';
import { getExchangeByName } from '_selectors/exchanges';
import { fetchMarkets } from '_actions/markets.actions';
import {
  selectTopCoinsQuote,
  selectTopMarketsPage,
  selectTopMarketsSorting
} from '_actions/selections.actions';
import { fetchMarketcapOverview } from '_actions/marketcap.actions';

class MarketOverviewContainer extends Component {
  getData() {
    this.props.fetchMarkets(this.props.selectedExchange.exchangeName);
    this.props.fetchMarketcapOverview();
  }

  componentDidMount() {
    this.getData();
  }

  componentDidUpdate(oldProps) {
    if (this.props.selectedExchange !== oldProps.selectedExchange) {
      this.getData();
    }
  }

  render() {
    return <MarketOverview {...this.props} />;
  }
}

const mapStateToProps = (state, ownProps) => {
  const { exchangeName } = ownProps.match.params;

  return {
    selectedExchange: getExchangeByName(state, exchangeName),
    selections: state.selections.marketOverview,
    marketcap: state.marketcap,
    markets: getMarketsByExchange(state, exchangeName),
    quotes: getMarketQuotes(state, exchangeName),
    sortedMarkets: getSortedMarketsByPairQuote(state, exchangeName),
    topCoins: getTopCoinsByVolume(state, exchangeName),
    history: ownProps.history
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchMarkets: exchangeName => dispatch(fetchMarkets(exchangeName)),
    fetchMarketcapOverview: () => dispatch(fetchMarketcapOverview()),
    selectTopCoinsQuote: value => dispatch(selectTopCoinsQuote(value)),
    selectTopMarketsPage: (...params) => dispatch(selectTopMarketsPage(...params)),
    selectTopMarketsSorting: (...params) => dispatch(selectTopMarketsSorting(...params))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MarketOverviewContainer);
