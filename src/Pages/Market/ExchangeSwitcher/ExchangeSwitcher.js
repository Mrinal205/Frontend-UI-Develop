import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import enhanceWithClickOutside from 'react-click-outside';
import { selectExchange } from '_actions/selections.actions';
import TimeAgo from 'react-timeago';

import { AllExchangesData } from '_constants';
import GridBox from 'components/GridBox/GridBox';
import { HelpTip } from 'components/HelpTip/HelpTip';

import './ExchangeSwitcher.scss';

const INACTIVITY_THRESHOLD = 60 * 1000;

export class ExchangeSwitcher extends Component {
  static propTypes = {
    exchanges: PropTypes.array.isRequired,
    selectExchange: PropTypes.func,
    showIndicator: PropTypes.bool,
    selectedExchange: PropTypes.object.isRequired,
    selectExchangeAction: PropTypes.func,
    optionAll: PropTypes.bool
  };

  constructor(props) {
    super(props);
    this.state = {
      isOpen: false
    };
    this.toggleDropdown = this.toggleDropdown.bind(this);
  }

  selectExchange(event, exchange) {
    this.toggleDropdown();

    // don't trigger if the same is selected
    if (exchange.exchangeName !== this.props.selectedExchange.exchangeName) {
      // if there is a custom action to be performed by the switcher
      // different to just the exchange Markets
      if (typeof this.props.selectExchangeAction === 'function') {
        event.preventDefault();
        this.props.selectExchangeAction(exchange);
      } else {
        this.props.selectExchange(exchange);
      }
    }
  }

  toggleDropdown() {
    this.setState(state => ({
      isOpen: !state.isOpen
    }));
  }

  handleClickOutside() {
    if (!this.state.isOpen) {
      return;
    }

    this.toggleDropdown();
  }

  /**
   * Checks if there is some actity on the exchange tickers/streams and returns the class suffix used to indicate the connection status.
   *
   * @returns {String} string representation of the connectivity status
   */
  getActivityIndicatorLabel() {
    const { lastActivity } = this.props.selectedExchange;

    const currentTime = new Date().getTime();

    const tickerActive =
      lastActivity.marketTicker && currentTime - lastActivity.marketTicker < INACTIVITY_THRESHOLD;

    const orderBookActive =
      lastActivity.orderBook && currentTime - lastActivity.orderBook < INACTIVITY_THRESHOLD;

    const tradesActive =
      lastActivity.trades && currentTime - lastActivity.trades < INACTIVITY_THRESHOLD;

    if (tickerActive && tradesActive && orderBookActive) {
      return 'all';
    } else if (!tickerActive && !tradesActive && !orderBookActive) {
      return 'none';
    } else {
      return 'some';
    }
  }

  renderMenu() {
    const { exchanges, selectedExchange, optionAll } = this.props;
    const list = (optionAll ? [AllExchangesData] : []).concat(
      exchanges.filter(e => e.exchangeName !== selectedExchange.exchangeName)
    );

    return (
      <div className="ExchangeSwitcher__menu">
        {list.map((exchange, index) => (
          <Link
            key={exchange.exchangeName}
            className="ExchangeSwitcher__menu-item"
            to={`/market/${exchange.exchangeName}`}
            onClick={event => this.selectExchange(event, exchange)}
          >
            {exchange.label}
          </Link>
        ))}
      </div>
    );
  }

  renderSelected() {
    const { selectedExchange } = this.props;

    return (
      <div className="ExchangeSwitcher__active-exchange" onClick={this.toggleDropdown}>
        {selectedExchange.label}
      </div>
    );
  }

  renderActivityIndicator() {
    if (this.props.showIndicator !== true) {
      return null;
    }

    const { lastActivity } = this.props.selectedExchange;

    const indicatorClass = classNames(
      'ExchangeSwitcher__indicator',
      `ExchangeSwitcher__indicator--${this.getActivityIndicatorLabel()}`
    );

    return (
      <HelpTip handle={<span className={indicatorClass} />} compact>
        <p>
          {`Last ticker update: `}
          {lastActivity.marketTicker ? <TimeAgo date={lastActivity.marketTicker} /> : 'no data'}
          <br />
          {`Last orderbook update: `}
          {lastActivity.orderBook ? <TimeAgo date={lastActivity.orderBook} /> : 'no data'}
          <br />
          {`Last trades update: `}
          {lastActivity.trades ? <TimeAgo date={lastActivity.trades} /> : 'no data'}
        </p>
      </HelpTip>
    );
  }

  renderContent() {
    const selectClassNames = classNames('ExchangeSwitcher__select', {
      'ExchangeSwitcher__select--is-open': this.state.isOpen
    });

    return (
      <div className="ExchangeSwitcher">
        {this.renderActivityIndicator()}
        <div className={selectClassNames}>
          {this.renderSelected()}
          {this.renderMenu()}
        </div>
      </div>
    );
  }

  render() {
    return <GridBox name="Exchange" title="Exchange" aside={this.renderContent()} />;
  }
}

function mapStateToProps(state, ownProps) {
  return {
    exchanges: ownProps.exchanges || state.exchanges
  };
}

const mapDispatchToProps = dispatch => {
  return {
    selectExchange
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(enhanceWithClickOutside(ExchangeSwitcher));
