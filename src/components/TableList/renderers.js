import React from 'react';
import moment from 'moment';

import InlineLabel from 'components/InlineLabel/InlineLabel';
import { DefaultDateFormat, DefaultTimeFormat } from '_constants';

import { formatCryptocurrency } from '_helpers';

import CloseButton from 'assets/close-button.svg';
import Spinner from 'components/Spinner/Spinner';
import TradeButton from 'components/TradeButton/TradeButton';
import CryptocurrencyIcon from 'components/CryptocurrencyIcon/CryptocurrencyIcon';

// render market trading pair cell
export const twoLineCellRenderer = row => {
  return (
    <div className="tl-value">
      <strong className="tl-value__primary">{row.value[0]}</strong>
      <span className="tl-value__secondary">{row.value[1]}</span>
    </div>
  );
};

export const simpleCellRenderer = row => {
  return (
    <div className="tl-value tl-simple">
      <strong className="tl-value__primary tl-offset--top">{row.value}</strong>
    </div>
  );
};

export const indexRankCellRenderer = (initialValue, row) => {
  // the first value is optional
  if (typeof row === 'undefined') {
    row = initialValue;
    initialValue = 0;
  }
  return (
    <div className="tl-value tl-simple">
      <strong className="tl-value__primary tl-offset--top tl-rank">
        {row.index + 1 + initialValue}
      </strong>
    </div>
  );
};

// value change cell
export const changeCellRenderer = ({ value = '' }) => {
  const valueAlmostZero = value.toFixed
    ? value.toFixed(2) === '0.00' || value.toFixed(2) === '-0.00'
    : false;
  if (valueAlmostZero || value === '0.00' || value === '-0.00' || value === '' || value === '-') {
    return <div className="tl-change tl-offset--top change-price neutral">0.00%</div>;
  }

  return (
    <div className={`tl-change tl-offset--top change-price ${value < 0 ? 'down' : 'up'}`}>
      {value && value.toFixed ? `${value.toFixed(2)}%` : `${value}%`}
    </div>
  );
};

// price change cell renderer
export const orderPriceCellRenderer = ({ value }) => (
  <div className={`tl-change ${value.change}`}>{value.value}</div>
);

export const balanceReservedCellRenderer = ({ value }) => (
  <strong>{value <= 0 ? <span className="tl-zero">0</span> : value}</strong>
);

export const cryptocurrencyCellRenderer = row => <strong>{formatCryptocurrency(row.value)}</strong>;

// custom component to render row with "bar" in the background
export const CustomRow = props => {
  // grab row
  const dataCell = props.children[3];
  const value = dataCell.props.children;

  return (
    <div className="rt-tr rt-tr--with-bar">
      {props.children}
      <div className="rt-tr-bar" style={{ width: `${value}%` }} />
    </div>
  );
};

export const orderTypeRenderer = ({ row }) => {
  const { offerType, orderType } = row._original;
  return (
    <span>
      {(offerType || orderType) && (
        <InlineLabel type={offerType} minWidth="4rem">
          {(offerType || '').toLowerCase()} {(orderType || '').toLowerCase()}
        </InlineLabel>
      )}
    </span>
  );
};

export const openOrderCancelRenderer = (cancelOrder, deleting, { row }) => {
  const { id, exchangeOrderId } = deleting || {};
  return (
    <span className="OpenOrders__Status-field">
      Open
      {(id && id === row._original.id) ||
      (exchangeOrderId && exchangeOrderId === row._original.exchangeOrderId) ? (
        <Spinner size="small" color="red" />
      ) : (
        <img
          className="OpenOrders__Status-field--close-button"
          src={CloseButton}
          alt=""
          onClick={cancelOrder.bind(null, row._original)}
        />
      )}
    </span>
  );
};

export const cryptoCoinIconRenderer = ({ row }) => {
  const { coin } = row._original;
  return (
    <div className="tl-center">
      <CryptocurrencyIcon icon={coin} size={14} />
      <strong className="tl-offset--left">{coin}</strong>
    </div>
  );
};

export const walletActionsRenderer = ({ row }) => {
  const { coin, quotes, exchange } = row._original;
  return <TradeButton exchange={exchange} coin={coin} quotes={quotes} />;
};

export const datetimeRenderer = ({ value }) => {
  return value ? (
    <span className="tl-value tl-value__secondary">
      {moment(value).format(DefaultDateFormat)}
      <span className="tl-offset--left">{moment(value).format(DefaultTimeFormat)}</span>
    </span>
  ) : (
    <span />
  );
};

export const mutedTextRenderer = ({ value }) => {
  return <span className="tl-value tl-value__secondary">{value}</span>;
};
