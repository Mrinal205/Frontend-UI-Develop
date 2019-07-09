import React from 'react';

import Page from 'components/Page/Page';
import { Row, Col, Container } from 'components/GridSystem/GridSystem';
import ExchangeSwitcher from '../Market/ExchangeSwitcher/ExchangeSwitcher';
import OpenOrders from '../Market/OpenOrders/OpenOrders';
import OrderHistory from '../Market/OrderHistory/OrderHistory';
import WalletHoldings from './WalletHoldings';
import { getWalletUrl } from '_helpers/links';
import GridBox from 'components/GridBox/GridBox';
import BalanceHeader from 'components/BalanceHeader';

import './Wallet.scss';

export class Wallet extends React.Component {
  selectExchange(exchange) {
    this.props.history.push(getWalletUrl(exchange.exchangeName));
  }

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

  renderLoading() {
    return <GridBox loading={true} loadingStyle="horizontal" loadingMessage="Fetching data..." />;
  }

  render() {
    const {
      selectedExchange,
      orders,
      openOrders,
      closedOrders,
      cancelOrder,
      balance,
      maxOrderPages,
      selectOrdersPage,
      exchanges,
      consolidated
    } = this.props;

    const aside = (
      <ExchangeSwitcher
        selectedExchange={selectedExchange}
        optionAll={true}
        selectExchangeAction={this.selectExchange.bind(this)}
        exchanges={exchanges}
      />
    );

    return (
      <Page title="Wallet" className="Wallet">
        <Container>
          <BalanceHeader {...{ consolidated, aside }} />
          <Row>
            <Col size="12">
              {this.recheckLoadingState(balance, exchanges, selectedExchange) ? (
                this.renderLoading()
              ) : (
                <WalletHoldings balance={balance} />
              )}
            </Col>
          </Row>
          <Row>
            <Col size="12">
              {this.recheckLoadingState(balance, exchanges, selectedExchange) ? (
                this.renderLoading()
              ) : (
                <OpenOrders
                  maxPages={maxOrderPages.open}
                  meta={orders.meta}
                  orders={openOrders}
                  selectedExchange={selectedExchange}
                  cancelOrder={cancelOrder}
                  contextColumns={true}
                />
              )}
            </Col>
          </Row>
          <Row>
            <Col size="12">
              {this.recheckLoadingState(balance, exchanges, selectedExchange) ? (
                this.renderLoading()
              ) : (
                <OrderHistory
                  maxPages={maxOrderPages.closed}
                  currentPage={orders.meta.closedOrdersPage}
                  orders={closedOrders}
                  selectedExchange={selectedExchange}
                  cancelOrder={cancelOrder}
                  contextColumns={true}
                  selectOrdersPage={selectOrdersPage}
                />
              )}
            </Col>
          </Row>
        </Container>
      </Page>
    );
  }
}

export default Wallet;
