import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import classnames from 'classnames';

import TableList from 'components/TableList/TableList';
import Pagination from 'components/Pagination/Pagination';
import {
  simpleCellRenderer,
  indexRankCellRenderer,
  changeCellRenderer,
  twoLineCellRenderer
} from 'components/TableList/renderers';
import { getMarketUrl } from '_helpers/links';
import { Order, DefaultMarketSorting } from '_constants';
import { formatVolume, formatCurrency, formatUsd } from '_helpers/formatting';

import './TopMarkets.scss';

const MAX_ROWS = 10;

export default class TopMarkets extends Component {
  static propTypes = {
    selectedExchange: PropTypes.object,
    sortedMarkets: PropTypes.object,
    quote: PropTypes.string,
    history: PropTypes.object.isRequired
  };

  handleRowClick(row) {
    const { history, selectedExchange } = this.props;
    history.push(getMarketUrl(selectedExchange.exchangeName, row.original.symbol));
  }

  handlePaginationClick(page) {
    this.props.selectTopMarketsPage(this.props.quote, page);
  }

  setSortingSettings(field) {
    const { sortBy, order, quote } = this.getSortingSettings();
    const newOrder = sortBy === field && order === Order.DESC ? Order.ASC : Order.DESC;
    this.props.selectTopMarketsSorting({ quote, sortBy: field, order: newOrder });
  }

  getSortingSettings() {
    const {
      selections: { topMarkets },
      quote
    } = this.props;
    const { sortBy = DefaultMarketSorting, order = Order.DESC, page = 0 } = topMarkets[quote] || {};
    return { sortBy, order, quote, page };
  }

  prepareTableData(markets, settings) {
    const { sortBy, order, page } = settings;
    const initialMarket = page * MAX_ROWS;

    const columns = [
      {
        Header: '#',
        accessor: 'rank',
        minWidth: 20,
        Cell: indexRankCellRenderer.bind(null, initialMarket)
      },
      {
        Header: 'Market',
        accessor: 'symbol',
        minWidth: 55,
        Cell: simpleCellRenderer
      },
      {
        Header: 'Volume 24h',
        isSortable: true,
        accessor: 'volume_24h',
        minWidth: 65,
        Cell: twoLineCellRenderer
      },
      {
        Header: 'Price',
        isSortable: true,
        accessor: 'price',
        minWidth: 55,
        Cell: twoLineCellRenderer
      },
      {
        Header: 'Change 24h',
        isSortable: true,
        accessor: 'change_24h',
        minWidth: 55,
        Cell: changeCellRenderer
      }
    ].map(item => {
      return {
        ...item,
        Header: !item.isSortable ? (
          item.Header
        ) : (
          <span
            className={classnames('rt-th-sortable', {
              'rt-th-selected': item.accessor === sortBy,
              'rt-th-selected-inverted': item.accessor === sortBy && order !== Order.DESC
            })}
            onClick={this.setSortingSettings.bind(this, item.accessor)}
          >
            {item.Header}
          </span>
        )
      };
    });

    const data = markets.slice(initialMarket, initialMarket + MAX_ROWS).map(m => {
      const { precision = {} } = m;

      return {
        symbol: m.symbol,
        price: [
          formatCurrency(m.price, {
            precision: precision.price
          }),
          formatUsd(m.price_usd)
        ],
        volume_24h: [formatVolume(m.volume_24h), formatUsd(m.volume_24h_usd, { precision: 0 })],
        change_24h: m.change_24h
      };
    });

    return {
      columns,
      data,
      onRowClick: this.handleRowClick.bind(this),
      clickable: true,
      overflow: true
    };
  }

  render() {
    const { lastRefresh, selectedExchange, sortedMarkets, quote } = this.props;

    const totalPages = Math.ceil(sortedMarkets[quote].length / MAX_ROWS);
    const settings = this.getSortingSettings();

    return (
      <div className="TopMarkets">
        <div className="TopMarkets__Header">
          <div className="TopMarkets__Header-title">
            {quote.toUpperCase()} Markets on {selectedExchange.label}
          </div>
          <TableList {...this.prepareTableData(sortedMarkets[quote], settings)} />
          <div className="TopMarkets__Footer">
            <Pagination
              currentPage={settings.page}
              totalPages={totalPages}
              selectPage={this.handlePaginationClick.bind(this)}
            />
            {lastRefresh && (
              <span>
                Last Update: {lastRefresh.toLocaleString()} ({moment(lastRefresh).fromNow()})
              </span>
            )}
          </div>
        </div>
      </div>
    );
  }
}
