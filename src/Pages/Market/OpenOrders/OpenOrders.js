import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash/object';

import GridBox from 'components/GridBox/GridBox';
import { Row, Col } from 'components/GridSystem/GridSystem';
import TableList from 'components/TableList/TableList';
import {
  datetimeRenderer,
  mutedTextRenderer,
  openOrderCancelRenderer,
  orderTypeRenderer,
  cryptocurrencyCellRenderer
} from 'components/TableList/renderers';
import Pagination from 'components/Pagination/Pagination';
import { Button } from 'components/Button/Button';
import { OrdersListAll } from '_constants';

import './OpenOrders.scss';

class OpenOrders extends Component {
  static propTypes = {
    orders: PropTypes.arrayOf(
      // TODO: Customize shape to API response
      PropTypes.shape({
        type: PropTypes.string,
        amount: PropTypes.number,
        price: PropTypes.number,
        datetime: PropTypes.string,
        filled: PropTypes.number,
        status: PropTypes.string
      })
    ),
    selectedExchange: PropTypes.object,
    selectedMarket: PropTypes.object,
    meta: PropTypes.object,
    cancelOrder: PropTypes.func,
    maxPages: PropTypes.number,
    currentPage: PropTypes.number,
    selectOrdersPage: PropTypes.func
  };

  static defaultProps = {
    orders: [],
    maxPages: 1,
    currentPage: 0,
    selectOrdersPage: () => {}
  };

  shouldComponentUpdate(nextProps, nextState) {
    const { orders, currentPage, selectOrdersPage } = this.props;

    return (
      orders !== nextProps.orders ||
      currentPage !== nextProps.currentPage ||
      selectOrdersPage !== nextProps.selectOrdersPage
    );
  }

  cancelOrder(order) {
    const { cancelOrder, selectedExchange } = this.props;
    cancelOrder(
      { ...order, symbolPair: order.symbolPair },
      order.exchangeName ? order.exchangeName : selectedExchange.exchangeName,
      order.symbolPair
    );
  }

  getTableData() {
    const deleting = get(this.props, 'meta.deleting', {});
    const cancelOrder = this.cancelOrder.bind(this);
    const contextFields = this.props.contextColumns
      ? [
          { Header: 'Market', accessor: 'symbolPair', minWidth: 80 },
          {
            Header: 'Exchange',
            accessor: 'exchangeLabel',
            className: 'tl-value__secondary',
            minWidth: 120
          }
        ]
      : [];

    const columns = [
      ...contextFields,
      { Header: 'Type', accessor: 'offerType', Cell: orderTypeRenderer, minWidth: 120 },
      { Header: 'Size', accessor: 'amount', minWidth: 100 },
      { Header: 'Price', accessor: 'price', minWidth: 100 },
      { Header: 'Total', accessor: 'total', Cell: cryptocurrencyCellRenderer, minWidth: 100 },
      { Header: 'Date / Time', accessor: 'timestamp', Cell: datetimeRenderer, minWidth: 120 },
      { Header: 'Filled', accessor: 'filled', Cell: mutedTextRenderer },
      {
        Header: 'Status',
        accessor: 'status',
        Cell: openOrderCancelRenderer.bind(null, cancelOrder, deleting)
      }
    ];

    const data = this.props.orders.map(order => ({
      ...order,
      filled: order.filled !== undefined ? `${order.filled}%` : undefined
    }));

    return {
      columns,
      data
    };
  }

  render() {
    const { maxPages, currentPage, selectOrdersPage } = this.props;

    return (
      <GridBox title="Open orders">
        <TableList {...this.getTableData()} noDataText="You don't have any open orders yet!" />
        <Row noMargin>
          <Col grow noMargin>
            {currentPage === OrdersListAll && (
              <Button micro neutral onClick={() => selectOrdersPage({ list: 'open', page: 0 })}>
                Collapse orders
              </Button>
            )}
            {maxPages > 1 && (
              <Button
                micro
                neutral
                onClick={() => selectOrdersPage({ list: 'open', page: OrdersListAll })}
              >
                See all filled orders
              </Button>
            )}
          </Col>
          <Col alignRight size={2} noMargin>
            {maxPages > 1 && (
              <Pagination
                currentPage={currentPage === OrdersListAll ? 0 : currentPage}
                totalPages={maxPages}
                selectPage={page => selectOrdersPage({ list: 'open', page })}
              />
            )}
          </Col>
        </Row>
      </GridBox>
    );
  }
}

export default OpenOrders;
