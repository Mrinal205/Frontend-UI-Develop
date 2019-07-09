import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { get } from 'lodash/object';

import { selectOrderbookPrice } from '_actions/orderbook.actions';
import GridBox from 'components/GridBox/GridBox';
import TableList from 'components/TableList/TableList';
import { orderPriceCellRenderer } from 'components/TableList/renderers';
import { formatCurrency } from '_helpers/formatting';
import { formatTimestamp } from '_helpers/dateTime';

import './MarketTrades.scss';

const MAX_TRADES_ROWS = 100;

export class MarketTrades extends Component {
  static propTypes = {
    trades: PropTypes.object,
    selectedMarket: PropTypes.object
  };

  shouldComponentUpdate(nextProps) {
    return nextProps.trades !== this.props.trades;
  }

  onRowClick(row) {
    this.props.selectOrderbookPrice(get(row, 'original.price.value'));
  }

  prepareTableData() {
    const tradesList = this.props.trades.list;
    const columns = [
      {
        Header: 'Price',
        accessor: 'price',
        minWidth: 50,
        Cell: orderPriceCellRenderer
      },
      {
        Header: 'Amount',
        accessor: 'amount',
        minWidth: 50
      },
      {
        Header: 'Time',
        accessor: 'time',
        minWidth: 30,
        className: 'tl-time'
      }
    ];
    const { precision } = this.props.selectedMarket;
    let data = tradesList.slice(0, MAX_TRADES_ROWS).map(trade => ({
      price: {
        value: formatCurrency(trade.price, { precision: precision.price }),
        change: ''
      },
      amount: trade.amount,
      time: formatTimestamp(trade.timestamp)
    }));

    // calculate relative change
    // walking from bottom
    for (let i = data.length - 2; i >= 0; i--) {
      if (data[i].price.value > data[i + 1].price.value) {
        data[i].price.change = 'up';
      } else if (data[i].price.value < data[i + 1].price.value) {
        data[i].price.change = 'down';
      } else {
        data[i].price.change = data[i + 1].price.change;
      }
    }

    return {
      columns,
      data,
      onRowClick: this.onRowClick.bind(this)
    };
  }

  renderTable() {
    const { trades } = this.props;
    if (trades === undefined || trades.list.length === 0) {
      return null;
    }

    return (
      <TableList
        condensed
        noRowLines
        headerSeparated
        clickable={true}
        {...this.prepareTableData()}
        style={{ maxHeight: 310 }}
      />
    );
  }

  render() {
    const { trades } = this.props;
    return (
      <GridBox title="Market Trades" loading={trades.meta.loading}>
        <div className="MarketTrades">
          <div className="MarketTrades__list">{this.renderTable()}</div>
        </div>
      </GridBox>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  selectOrderbookPrice: price => dispatch(selectOrderbookPrice(price))
});

const mapStateToProps = state => {
  return {
    trades: state.trades
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MarketTrades);
