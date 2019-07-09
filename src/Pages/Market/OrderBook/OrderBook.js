import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Select from 'components/Select/Select';
import GridBox from 'components/GridBox/GridBox';
import TableList from 'components/TableList/TableList';
import Pagination from 'components/Pagination/Pagination';
import { CustomRow, cryptocurrencyCellRenderer } from 'components/TableList/renderers';

import { orderbookByPrecisionSelector } from '_selectors/orderbook';
import MarketPrice from './MarketPrice';

import { OrderbookRowLimit } from '_constants';
import { getTradingPair } from '_helpers';

import {
  selectOrderbookPage,
  selectOrderbookPrice,
  selectOrderbookPrecision
} from '_actions/orderbook.actions';

import './OrderBook.scss';

const BIDS_AREA = 'bids';
const ASKS_AREA = 'asks';

export class OrderBook extends Component {
  static propTypes = {
    selectedExchange: PropTypes.object.isRequired,
    selectedMarket: PropTypes.object.isRequired,
    orderbook: PropTypes.object,
    trades: PropTypes.array
  };

  constructor(props) {
    super(props);
    this.state = { precisionOptions: [] };
  }

  componentDidMount() {
    this.setDefaultPrecision();
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.trades !== this.props.trades || nextProps.orderbook !== this.props.orderbook;
  }

  componentWillReceiveProps(nextProps) {
    const {
      selectedMarket: { symbol }
    } = nextProps;
    if (this.props.selectedMarket.symbol !== symbol) {
      this.setDefaultPrecision(nextProps);
    }
  }

  onRowClick(row) {
    const {
      selectedExchange: { exchangeName },
      selectOrderbookPrice
    } = this.props;
    if (row && row.original && row.original.price) {
      selectOrderbookPrice(row.original.price, exchangeName);
    }
  }

  setDefaultPrecision(props) {
    const { selectedMarket } = props || this.props;
    const { precision } = selectedMarket;
    const maxPrecision = precision.price;
    this.props.selectOrderbookPrecision(precision);
    // cache options for precision selector
    const options = [];
    for (let i = 2; i <= maxPrecision; i++) {
      options.push({ value: i, label: `${i} decimals` });
    }
    this.setState({ precisionOptions: options, maxPrecision });
  }

  prepareTableData(area) {
    const { selectedMarket } = this.props;
    const { base, quote } = getTradingPair(selectedMarket);
    const rawOrderbookData = this.props[area];

    const columns = [
      {
        Header: `Price ${quote}`,
        accessor: 'price',
        minWidth: 30,
        headerClassName: 'ob-th-price',
        className: 'ob-td-price'
      },
      {
        Header: `Amount ${base}`,
        accessor: 'amount',
        minWidth: 30,
        headerClassName: 'rt-right',
        className: 'rt-right'
      },
      {
        Header: `Total`,
        accessor: 'total',
        minWidth: 30,
        headerClassName: 'rt-right ob-th-total',
        className: 'rt-right ob-td-total',
        Cell: cryptocurrencyCellRenderer
      },
      {
        Header: null,
        accessor: 'volume',
        minWidth: 0,
        headerClassName: 'rt-hidden',
        className: 'rt-hidden',
        Cell: ({ value }) => value
      }
    ];

    // if initial data was empty, return empty dataset
    if (rawOrderbookData === undefined || rawOrderbookData.length === 0) {
      return {
        columns,
        data: []
      };
    }

    return {
      columns: columns,
      data: rawOrderbookData,
      onRowClick: this.onRowClick.bind(this)
    };
  }

  renderOrderBookTable() {
    const { selectedMarket } = this.props;

    return (
      <React.Fragment>
        <div className="OrderBook__column OrderBook__column--asks">
          <TableList
            TrComponent={CustomRow}
            noRowLines
            condensed
            headerSeparated
            clickable={true}
            minRows={OrderbookRowLimit}
            {...this.prepareTableData(ASKS_AREA)}
          />
        </div>
        <MarketPrice market={selectedMarket} />
        <div className="OrderBook__column OrderBook__column--bids">
          <TableList
            TrComponent={CustomRow}
            noRowLines
            condensed
            headerSeparated
            TheadComponent={() => null}
            clickable={true}
            minRows={OrderbookRowLimit}
            {...this.prepareTableData(BIDS_AREA)}
          />
        </div>
      </React.Fragment>
    );
  }

  /* TODO: We're currently not rendering the footer with pagination
   * keeping the code in case we change our mind
   */
  renderFooter() {
    const { orderbook, selectOrderbookPage } = this.props;

    const pagingInfo = {
      [BIDS_AREA]: {
        currentPage: orderbook.page[BIDS_AREA] || 0,
        totalPages: Math.ceil(orderbook[BIDS_AREA].length / OrderbookRowLimit)
      },
      [ASKS_AREA]: {
        currentPage: orderbook.page[ASKS_AREA] || 0,
        totalPages: Math.ceil(orderbook[ASKS_AREA].length / OrderbookRowLimit)
      }
    };

    return (
      <div className="OrderBook__footer">
        <div className="OrderBook__footer-bids">
          <Pagination
            currentPage={pagingInfo[BIDS_AREA].currentPage}
            totalPages={pagingInfo[BIDS_AREA].totalPages}
            selectPage={page => selectOrderbookPage(BIDS_AREA, page)}
          />
        </div>
        <div className="OrderBook__footer-asks">
          <Pagination
            currentPage={pagingInfo[ASKS_AREA].currentPage}
            totalPages={pagingInfo[ASKS_AREA].totalPages}
            selectPage={page => selectOrderbookPage(ASKS_AREA, page)}
          />
        </div>
      </div>
    );
  }

  render() {
    const { orderbook, selectOrderbookPrecision } = this.props;
    const { precisionOptions } = this.state;
    if (orderbook.meta.loading) {
      return <GridBox name="OrderBook" title="Order Book" loading={true} />;
    }

    if (orderbook.meta.error) {
      return (
        <GridBox name="OrderBook" title="Order Book">
          <p>Sorry, the data is not available at the moment!</p>
        </GridBox>
      );
    }

    const decimalSelector = (
      <Select
        value={orderbook.precision ? orderbook.precision.price : 8}
        options={precisionOptions}
        onChange={option =>
          selectOrderbookPrecision({
            ...orderbook.precision,
            price: option.value
          })
        }
        clearable={false}
        removeSelected={false}
        searchable={false}
      />
    );

    return (
      <GridBox name="OrderBook" title="Order Book" aside={decimalSelector}>
        <div className="OrderBook">{this.renderOrderBookTable()}</div>
      </GridBox>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const { bids, asks } = orderbookByPrecisionSelector(state);

  return {
    trades: state.trades.list,
    orderbook: state.orderbook,
    bids,
    asks
  };
};

const mapDispatchToProps = {
  selectOrderbookPage,
  selectOrderbookPrice,
  selectOrderbookPrecision
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OrderBook);
