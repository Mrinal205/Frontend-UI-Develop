import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { get } from 'lodash/object';
import classnames from 'classnames';

import { getMarketsByExchange, getMarketQuotes, getFilteredMarkets } from '_selectors/markets';

import { getTradingPair } from '_helpers';
import { formatVolume, formatCurrency, formatUsd, formatPercentage } from '_helpers/formatting';
import { getMarketUrl } from '_helpers/links';
import { Order } from '_constants';

import { selectMarketsSorting } from '_actions/selections.actions';

import GridBox from 'components/GridBox/GridBox';
import Select from 'components/Select/Select';
import TableList from 'components/TableList/TableList';
import {
  twoLineCellRenderer,
  changeCellRenderer,
  simpleCellRenderer
} from 'components/TableList/renderers.js';

import './MarketsList.scss';

export class MarketsList extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    height: PropTypes.number,
    markets: PropTypes.object,
    quotes: PropTypes.array,
    selectedExchange: PropTypes.object,
    selectedMarket: PropTypes.object
  };

  constructor() {
    super();

    this.state = {
      baseFilter: '',
      quoteFilter: ''
    };

    this.handleMarketQuoteFilterChange = this.handleMarketQuoteFilterChange.bind(this);
    this.handleMakerBaseFilterChange = this.handleMakerBaseFilterChange.bind(this);
    this.handleRowClick = this.handleRowClick.bind(this);
  }

  /**
   * Sets first available quote as internal state
   * @param {Array} quotes
   */
  setPreferredQuote() {
    const { quotes, selectedMarket } = this.props;

    // don't change if quote is already set,
    if (this.state.quoteFilter !== '') {
      return;
    }

    const { quote } = getTradingPair(selectedMarket);
    const quoteFilter = quote ? quote : quotes[0];

    // if quotes are available, select first
    if (quoteFilter) {
      this.setState({
        quoteFilter: quoteFilter
      });
    }
  }

  /**
   * Resets both filters
   */
  resetFilters() {
    this.setState({
      quoteFilter: '',
      baseFilter: ''
    });
  }

  /**
   * On component mount, set preferred quote filter
   */
  componentDidMount() {
    this.setPreferredQuote();
  }

  /**
   * On component update, check if exchange changed and reset filters
   * @param {Object} oldProps
   */
  componentDidUpdate(oldProps) {
    this.setPreferredQuote();
    if (oldProps.selectedExchange !== this.props.selectedExchange) {
      this.resetFilters();
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      nextProps.markets !== this.props.markets ||
      nextProps.quotes !== this.props.quotes ||
      nextProps.selections !== this.props.selections ||
      nextState !== this.state
    );
  }

  /**
   * Handles market QUOTE filtering dropdown change
   * @param {Object} option
   */
  handleMarketQuoteFilterChange(option) {
    this.setState({
      baseFilter: '',
      quoteFilter: option.value
    });
  }

  /**
   * Handles market BASE currency filtering input change
   * @param {Event} event
   */
  handleMakerBaseFilterChange(event) {
    this.setState({
      baseFilter: event.target.value
    });
  }

  /**
   * Handles click event on table row (Changes market details page)
   * @param {Object} row
   */
  handleRowClick(row) {
    const { history, selectedExchange } = this.props;
    history.push(getMarketUrl(selectedExchange.exchangeName, row.original.symbol));
  }

  /**
   * Renders JSX fragment responsible for filter area
   */
  renderFilters() {
    return (
      <div className="MarketsList__filter">
        <Select
          value={this.state.quoteFilter}
          options={this.props.quotes}
          onChange={this.handleMarketQuoteFilterChange}
          clearable={false}
          removeSelected={true}
          searchable={false}
        />

        {/* Workaround for disabling Chrome autocomplete" */}
        <input type="hidden" value="anything" />

        <input
          className="MarketsList__input"
          value={this.state.marketBaseFilter}
          name="filter"
          placeholder="Search..."
          autoComplete="off"
          onChange={this.handleMakerBaseFilterChange}
        />
      </div>
    );
  }

  setSortingSettings(field) {
    const { sortBy, order } = this.getSortingSettings();
    const newOrder = sortBy === field && order === Order.DESC ? Order.ASC : Order.DESC;
    this.props.selectMarketsSorting({ sortBy: field, order: newOrder });
  }

  getSortingSettings() {
    const { selections } = this.props;
    const { sortBy = 'market', order = Order.DESC } = selections.marketsList || {};
    return { sortBy, order };
  }

  /**
   * Prepares table data structure, required by TableList component
   */
  prepareTableData() {
    const { sortBy, order } = this.getSortingSettings();

    const columns = [
      {
        Header: 'Coin',
        accessor: 'market',
        minWidth: 40,
        isSortable: true,
        Cell: simpleCellRenderer
      },
      {
        Header: 'Price',
        accessor: 'price',
        minWidth: 70,
        isSortable: true,
        Cell: twoLineCellRenderer
      },
      {
        Header: 'Volume 24h',
        accessor: 'volume_24h',
        minWidth: 70,
        isSortable: true,
        Cell: twoLineCellRenderer
      },
      {
        Header: 'Change 24h',
        accessor: 'change_24h',
        isSortable: true,
        minWidth: 50,
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

    const markets = getFilteredMarkets(
      this.props.markets,
      this.state.quoteFilter,
      this.state.baseFilter
    ).sort((a, b) => {
      if (sortBy === 'market') {
        return order === Order.DESC
          ? b['symbol'] < a['symbol']
            ? 1
            : -1
          : a['symbol'] < b['symbol']
            ? 1
            : -1;
      }

      return order === Order.DESC ? b[sortBy] - a[sortBy] : a[sortBy] - b[sortBy];
    });

    const data = markets.map(m => {
      const { base } = getTradingPair(m);
      const { precision = {} } = m;

      return {
        symbol: m.symbol,
        market: base,
        price: [
          formatCurrency(m.price, {
            precision: precision.price
          }),
          formatUsd(m.price_usd)
        ],
        volume_24h: [formatVolume(m.volume_24h), formatUsd(m.volume_24h_usd, { precision: 0 })],
        change_24h: formatPercentage(m.change_24h, { includeSymbol: false })
      };
    });

    return {
      columns,
      data
    };
  }

  highlightSelectedRow = (state, rowInfo) => {
    const symbol = get(this.props, 'selectedMarket.symbol', '');
    return {
      className: rowInfo && rowInfo.original.symbol === symbol ? 'rt-tr--selected' : undefined
    };
  };

  /**
   * Renders JSX fragment rsponsible for main table list area
   */
  renderList() {
    const tableData = this.prepareTableData();
    const height = this.props.height || 325;
    const hasScroll = tableData.data.length * 50 > height;

    return (
      <div
        className={classnames('MarketsList__list', { 'MarketsList__list--scrollable': hasScroll })}
      >
        <TableList
          {...tableData}
          style={{ minHeight: height, maxHeight: height }}
          onRowClick={this.handleRowClick}
          getTrGroupProps={this.highlightSelectedRow}
          noDataText="No coins found."
          overflow
          clickable
          negativeMargin
        />
      </div>
    );
  }

  /**
   * Main component render method
   */
  render() {
    const { markets = {} } = this.props;
    return (
      <GridBox
        title="Markets"
        loadingMessage="Fetching Market Data from the Exchange..."
        {...markets.meta}
      >
        <div className="MarketsList">
          {this.renderFilters()}
          {this.renderList()}
        </div>
      </GridBox>
    );
  }
}

const mapsStateToProps = (state, ownProps) => {
  const { selectedExchange } = ownProps;
  return {
    markets: getMarketsByExchange(state, selectedExchange.exchangeName),
    quotes: getMarketQuotes(state, selectedExchange.exchangeName),
    selections: state.selections.marketDetails
  };
};

const mapDispatchToProps = dispatch => {
  return {
    selectMarketsSorting: (...params) => dispatch(selectMarketsSorting(...params))
  };
};

export default withRouter(
  connect(
    mapsStateToProps,
    mapDispatchToProps
  )(MarketsList)
);
