import React from 'react';
import classnames from 'classnames';
import { Link } from 'react-router-dom';

import { Button } from 'components/Button';
import Modal from 'components/Modal/Modal';

import './ConnectedExchanges.scss';

export class ConnectedExchanges extends React.Component {
  static defaultProps = {
    availableExchanges: [],
    exchanges: []
  };

  constructor(props) {
    super(props);

    this.state = {
      contextExchange: null
    };
  }

  handleDisconnectIntentClick = (event, contextExchange) => {
    event.preventDefault();
    this.setState({
      contextExchange
    });
  };

  handleDisconnectIntentCancel = () => {
    this.setState({
      contextExchange: null
    });
  };

  handleDisconnectConfirm = exchange => {
    this.props.onDisconnect(exchange);
    this.setState({
      contextExchange: null
    });
  };

  renderConfirmRemovalModal() {
    const { contextExchange } = this.state;
    if (!contextExchange) {
      return null;
    }

    const modalProps = {
      headline: `Confirm removal of ${contextExchange.label} API Key`,
      isOpen: true,
      onRequestClose: this.handleDisconnectIntentCancel,
      actions: {
        confirm: {
          label: 'Confirm',
          onConfirm: () => {
            this.handleDisconnectConfirm(contextExchange);
          }
        }
      }
    };

    return (
      <Modal {...modalProps}>
        <p>
          {`You will loose access to your ${contextExchange.label} Account
          and any advance orders you may have placed.`}
        </p>
      </Modal>
    );
  }

  renderExchange(exchange) {
    const exchangeClasses = classnames('Exchange', {
      'Exchange--is-disabled': exchange.meta.connected !== true
    });

    return (
      <div className={exchangeClasses}>
        <span className="Exchange__icon" />
        <span className="Exchange__name">{exchange.label}</span>
        <div className="Exchange__actions">
          <Button outlined onClick={event => this.handleDisconnectIntentClick(event, exchange)}>
            Delete
          </Button>
        </div>
      </div>
    );
  }

  renderList() {
    const { exchanges } = this.props;

    return (
      <ul className="Exchanges__list">
        {exchanges.map(exchange => (
          <li className="Exchanges__item" key={exchange.exchangeName}>
            {this.renderExchange(exchange)}
          </li>
        ))}
      </ul>
    );
  }

  renderAddButton() {
    return (
      <div className="Exchanges__actions">
        <Link to="/account/exchanges/add" className="Exchanges__add">
          Add Exchange
        </Link>
      </div>
    );
  }

  render() {
    const { availableExchanges, exchanges } = this.props;

    return (
      <div className="Exchanges">
        {exchanges.length > 0 && this.renderList()}
        {availableExchanges.length > 0 && this.renderAddButton()}
        {this.renderConfirmRemovalModal()}
      </div>
    );
  }
}

export default ConnectedExchanges;
