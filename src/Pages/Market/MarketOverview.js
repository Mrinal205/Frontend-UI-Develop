import React from 'react';
import PropTypes from 'prop-types';

import Page from 'components/Page/Page';
import { Row, Col, Container } from 'components/GridSystem/GridSystem';

import ExchangeSwitcher from './ExchangeSwitcher/ExchangeSwitcher';
import MarketsList from './MarketsList/MarketsList';
import TopMarkets from './TopMarkets/TopMarkets';
import TopCoinsCharts from './TopCoinsCharts/TopCoinsCharts';

import { formatUsd } from '_helpers/formatting';

import './MarketOverview.scss';

export class MarketOverview extends React.Component {
  static propTypes = {
    marketcap: PropTypes.object.isRequired,
    selectedExchange: PropTypes.object,
    sortedMarkets: PropTypes.object,
    quote: PropTypes.string,
    quotes: PropTypes.array,
    history: PropTypes.object.isRequired,
    selectTopCoinsQuote: PropTypes.func.isRequired,
    markets: PropTypes.object
  };

  renderHeader() {
    const { marketcap } = this.props;

    return (
      <div className="MarketOverview__Header">
        <Container className="no-padding">
          <Row className="no-margin">
            <Col size="6">
              <div className="MarketOverview__Header-title">Total Cryptocurrency Marketcap</div>
              <div className="MarketOverview__Header-value">
                {formatUsd(marketcap.total_market_cap_usd, { precision: 0 })}
              </div>
            </Col>
            <Col size="3">
              <div className="MarketOverview__Header-secondary-title">24h Volume</div>
              <div className="MarketOverview__Header-secondary-value">
                {formatUsd(marketcap.total_24h_volume_usd, { precision: 0 })}
              </div>
            </Col>
            <Col size="3">
              <div className="MarketOverview__Header-secondary-title">BTC Dominance</div>
              <div className="MarketOverview__Header-secondary-value">
                {marketcap.bitcoin_percentage_of_market_cap}%
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }

  render() {
    const {
      selectedExchange,
      markets,
      quotes,
      sortedMarkets,
      selections,
      history,
      topCoins,
      selectTopCoinsQuote,
      selectTopMarketsPage,
      selectTopMarketsSorting
    } = this.props;

    const title = `${selectedExchange.label} - Market overview`;

    return (
      <Page title={title} className="MarketOverview">
        <Container>
          <Row>
            <Col size="9" grow>
              {this.renderHeader()}
            </Col>
            <Col size="3" className="Side-column">
              <ExchangeSwitcher selectedExchange={selectedExchange} />
            </Col>
          </Row>

          <Row>
            <Col size="9" grow>
              <TopCoinsCharts
                selections={selections}
                selectedExchange={selectedExchange}
                quotes={quotes}
                coins={topCoins}
                selectTopCoinsQuote={selectTopCoinsQuote}
              />
            </Col>
            <Col size="3" overflow className="Side-column">
              <MarketsList selectedExchange={selectedExchange} height={355} />
            </Col>
          </Row>

          <section className="TopMarkets__container">
            {quotes.map((quote, i) => (
              <TopMarkets
                key={i}
                sortedMarkets={sortedMarkets}
                quote={quote}
                selections={selections}
                selectedExchange={selectedExchange}
                lastRefresh={markets.meta.timestamp}
                history={history}
                selectTopMarketsPage={selectTopMarketsPage}
                selectTopMarketsSorting={selectTopMarketsSorting}
              />
            ))}
            {quotes.length % 2 !== 0 && <div className="TopMarkets__placeholder" />}
          </section>
        </Container>
      </Page>
    );
  }
}

export default MarketOverview;
