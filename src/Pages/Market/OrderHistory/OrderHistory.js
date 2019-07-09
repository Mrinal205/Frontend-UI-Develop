import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Row, Col } from 'components/GridSystem/GridSystem';
import GridBox from 'components/GridBox/GridBox';
import TableList from 'components/TableList/TableList';
import Pagination from 'components/Pagination/Pagination';
import { Button } from 'components/Button/Button';
import {
  orderTypeRenderer,
  datetimeRenderer,
  cryptocurrencyCellRenderer
} from 'components/TableList/renderers';
import { OrdersListAll } from '_constants';

class OrderHistory extends Component {
  static propTypes = {
    orders: PropTypes.arrayOf(
      // TODO: Customize shape to API response
      PropTypes.shape({
        type: PropTypes.string,
        size: PropTypes.number,
        price: PropTypes.number,
        datetime: PropTypes.string
      })
    ),
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

  shouldComponentUpdate(nextProps) {
    return (
      nextProps.currentPage !== this.props.currentPage || nextProps.orders !== this.props.orders
    );
  }

  getTableData() {
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
      { Header: 'Deal Price', accessor: 'price', minWidth: 100 },
      { Header: 'Total', accessor: 'total', Cell: cryptocurrencyCellRenderer, minWidth: 100 },
      { Header: 'Date / Time', accessor: 'timestamp', Cell: datetimeRenderer, minWidth: 120 },
      { Header: '', accessor: 'blank', className: 'rt-overflow' },
      { Header: 'Status', accessor: 'status' }
    ];

    const data = this.props.orders.map(order => ({
      ...order,
      status:
        order.status !== undefined
          ? `${order.status.charAt(0).toUpperCase()}${order.status.substr(1).toLowerCase()}`
          : undefined
    }));

    const getTdProps = (state, rowInfo, column, instance) => {
      return {
        className: rowInfo && rowInfo.row.status.toUpperCase() === 'CANCELED' ? 'rt-td--faded' : ''
      };
    };

    return {
      columns,
      data,
      getTdProps
    };
  }

  render() {
    const { maxPages, currentPage, selectOrdersPage } = this.props;

    return (
      <GridBox title="Order History">
        <TableList {...this.getTableData()} noDataText="You don't have any orders yet!" />
        <Row noMargin>
          <Col grow noMargin>
            {currentPage === OrdersListAll && (
              <Button micro neutral onClick={() => selectOrdersPage({ list: 'closed', page: 0 })}>
                Collapse orders
              </Button>
            )}
            {maxPages > 1 && (
              <Button
                micro
                neutral
                onClick={() => selectOrdersPage({ list: 'closed', page: OrdersListAll })}
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
                selectPage={page => selectOrdersPage({ list: 'closed', page })}
              />
            )}
          </Col>
        </Row>
      </GridBox>
    );
  }
}

export default OrderHistory;
