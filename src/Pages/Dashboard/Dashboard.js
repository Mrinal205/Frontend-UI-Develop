import React, { Component } from 'react';
import Page from 'components/Page/Page';
import { Row, Col, Container } from 'components/GridSystem/GridSystem';
import BalanceHeader from 'components/BalanceHeader';
import OpenOrders from '../Market/OpenOrders/OpenOrders';

import DashboardHoldings from './DashboardHoldings/DashboardHoldings';
import DashboardHoldingsChart from './DashboardHoldings/DashboardHoldingsChart';
import NetworthChart from './NetworthChart/NetworthChart';
import NetworthBalances from './NetworthBalances/NetworthBalances';

import './Dashboard.scss';

class Dashboard extends Component {
  recheckLoadingState(balance, exchanges, selectedExchange) {
    let isLoading = true;
    if (balance && selectedExchange) {
      let allExchanges = [];
      if (selectedExchange.exchangeName !== 'ALL') {
        allExchanges.push(selectedExchange.exchangeName);
      } else {
        allExchanges = exchanges.map(e => e.exchangeName);
      }
      let allBalances = [];
      for (let i = 0; i < balance.length; i++) {
        if (allBalances.indexOf(balance[i].exchange) === -1) {
          allBalances.push(balance[i].exchange);
        }
      }
      if (allBalances.length === allExchanges.length) {
        isLoading = false;
      }
    }
    return isLoading;
  }

  render() {
    const {
      selectedExchange,
      orders,
      openOrders,
      cancelOrder,
      balance,
      exchanges,
      networth,
      markets,
      maxOrderPages,
      consolidated
    } = this.props;

    const loading = this.recheckLoadingState(balance, exchanges, selectedExchange);

    return (
      <Page title="Dashboard" className="Dashboard">
        <Container>
          <NetworthBalances markets={markets} networth={networth} />
          <NetworthChart networth={networth} />

          <Row>
            <Col size="6">
              <div className="Dashboard__Chart">
                <div className="Dashboard__Chart--wrapper">
                  <DashboardHoldingsChart balance={balance} loading={loading} />
                </div>
              </div>
            </Col>
            <Col size="6">
              <div className="Dashboard__Holdings--stacked">
                <BalanceHeader isCompact consolidated={consolidated} />
                <DashboardHoldings loading={loading} balance={balance} />
              </div>
            </Col>
          </Row>

          <Row>
            <Col size="12">
              <OpenOrders
                maxPages={maxOrderPages.open}
                meta={orders.meta}
                orders={openOrders}
                selectedExchange={selectedExchange}
                cancelOrder={cancelOrder}
                contextColumns={true}
              />
            </Col>
          </Row>
        </Container>
      </Page>
    );
  }
}

export default Dashboard;
