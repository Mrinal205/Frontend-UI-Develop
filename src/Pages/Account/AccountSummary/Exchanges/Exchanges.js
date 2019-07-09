import React from 'react';
import { Link } from 'react-router-dom';
import classnames from 'classnames';

import './Exchanges.scss';

const Exchanges = ({ exchanges = [] }) => {
  if (exchanges.length === 0) {
    return (
      <div className="AccountExchanges">
        <p>You don't have any exchange connected yet!</p>
        <div className="AccountExchanges__promo">
          <Link className="button button--inline" to="/account/exchanges">
            Connect your first exchange
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="AccountExchanges">
      <ul className="AccountExchanges__list">
        {exchanges.map(exchange => {
          const labelClassName = classnames({
            AccountExchanges__label: true,
            'AccountExchanges__label--disabled': exchange.meta.connected !== true
          });
          return (
            <li className="AccountExchanges__item" key={exchange.exchangeName}>
              <span className={labelClassName}>{exchange.label}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Exchanges;
