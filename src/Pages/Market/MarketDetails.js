import React from 'react';
import PropTypes from 'prop-types';

import Page from 'components/Page/Page';
import { Row, Col, Container } from 'components/GridSystem/GridSystem';
import GridBox from 'components/GridBox/GridBox';
import ErrorBoundary from 'components/ErrorBoundary/ErrorBoundary';

import MarketSummary from './MarketSummary/MarketSummary';
import ExchangeSwitcher from './ExchangeSwitcher/ExchangeSwitcher';

import MarketsList from './MarketsList/MarketsList';
import MarketChart from './MarketChart/MarketChart';

// import ChartSwitch from './ChartSwitch/ChartSwitch';

import DepthChart from './DepthChart/DepthChart';

import MarketTrades from './MarketTrades/MarketTrades';
import OrderBook from './OrderBook/OrderBook';

import AdvancedMarketFormContainer from './MarketForm/AdvancedMarketFormContainer';

import OpenOrders from './OpenOrders/OpenOrders';
import OrderHistory from './OrderHistory/OrderHistory';
import { getTradingSymbol } from '_helpers';

const ChartTypes = {
  MarketChart: {
    id: 'MarketChart',
    title: 'Price'
  },
  DepthChart: {
    id: 'DepthChart',
    title: 'Depth'
  }
};

export class MarketDetails extends React.Component {
  static propTypes = {
    selectedExchange: PropTypes.object,
    selectedMarket: PropTypes.object,
    selectedMarketLimits: PropTypes.object
  };

  constructor(props) {
    super(props);
    this.state = {
      showChartId: ChartTypes.MarketChart.id
    };
  }

  changeChartType = chartType => {
    this.setState({ showChartId: chartType });
  };

  renderChart() {
    switch (this.state.showChartId) {
      case ChartTypes.MarketChart.id:
        return this.renderMarketChart();
      case ChartTypes.DepthChart.id:
        return this.renderDepthChart();
      default:
        return this.renderMarketChart();
    }
  }

  renderDepthChart() {
    const { selectedExchange, selectedMarket } = this.props;
    const chartSymbol = getTradingSymbol(selectedExchange.exchangeName, selectedMarket.symbol);
    return <DepthChart symbol={chartSymbol} market={selectedMarket} />;
  }

  renderMarketChart() {
    const { selectedExchange, selectedMarket } = this.props;
    const chartSymbol = getTradingSymbol(selectedExchange.exchangeName, selectedMarket.symbol);
    return <MarketChart symbol={chartSymbol} market={selectedMarket} />;
  }

  renderLoading() {
    return (
      <Page title="Market Details" className="MarketDetails">
        <Container>
          <GridBox loading transparent loadingMessage="Loading market data" />
        </Container>
      </Page>
    );
  }

  render() {
    const {
      selectedExchange,
      selectedMarket,
      selectedMarketLimits,
      orders,
      openOrders,
      closedOrders,
      cancelOrder,
      selectOrdersPage,
      maxOrderPages
    } = this.props;

    if (selectedMarket === undefined) {
      return this.renderLoading();
    }

    const title = `${selectedMarket.symbol} - ${selectedExchange.exchangeName} - Market Details`;

    return (
      <Page title={title} className="MarketDetails">
        <Container>
          <Row>
            <Col size="9" grow>
              <MarketSummary market={selectedMarket} />
            </Col>
            <Col size="3" className="Side-column">
              <ExchangeSwitcher selectedExchange={selectedExchange} showIndicator />
            </Col>
          </Row>
          <Row>
            <Col size="2" className="Side-column">
              <OrderBook selectedExchange={selectedExchange} selectedMarket={selectedMarket} />
            </Col>
            <Col grow>
              <Row>
                <Col size="9" grow>
                  <GridBox>
                    <ErrorBoundary
                      retry="Reload"
                      errorMessage="Market data is not available at the moment."
                    >
                      {/*
                        TODO: MarketDepth Chart is disabled until fixed
                        <ChartSwitch
                          showChartId={this.state.showChartId}
                          ChartTypes={ChartTypes}
                          changeChartType={this.changeChartType}
                        />
                      */}
                      {this.renderChart()}
                    </ErrorBoundary>
                  </GridBox>
                </Col>
                <Col size="3" className="Side-column" overflow>
                  <MarketsList
                    height={310}
                    selectedExchange={selectedExchange}
                    selectedMarket={selectedMarket}
                  />
                </Col>
              </Row>

              <Row className="MarketForms" noMargin>
                <Col size="9" grow>
                  <AdvancedMarketFormContainer
                    selectedExchange={selectedExchange}
                    selectedMarket={selectedMarket}
                    selectedMarketLimits={selectedMarketLimits}
                  />
                </Col>
                <Col size="3" className="Side-column">
                  <MarketTrades selectedMarket={selectedMarket} />
                </Col>
              </Row>
            </Col>
          </Row>

          <Row>
            <Col>
              <OpenOrders
                meta={orders.meta}
                currentPage={orders.meta.openOrdersPage}
                orders={openOrders}
                selectedExchange={selectedExchange}
                selectedMarket={selectedMarket}
                cancelOrder={cancelOrder}
                selectOrdersPage={selectOrdersPage}
                maxPages={maxOrderPages.open}
              />
            </Col>
          </Row>

          <Row>
            <Col>
              <OrderHistory
                meta={orders.meta}
                currentPage={orders.meta.closedOrdersPage}
                orders={closedOrders}
                selectedExchange={selectedExchange}
                selectedMarket={selectedMarket}
                selectOrdersPage={selectOrdersPage}
                maxPages={maxOrderPages.closed}
              />
            </Col>
          </Row>
        </Container>
      </Page>
    );
  }
}

export default MarketDetails;
