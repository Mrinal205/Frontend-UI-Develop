import React from 'react';
import { Row, Col } from 'components/GridSystem/GridSystem';
import { formatUsd, formatCurrency } from '_helpers/formatting';

import './BalanceHeader.scss';

const renderAside = (aside, isCompact) => {
  if (!aside) return null;
  if (typeof aside === 'function')
    return (
      <Col className="Side-column" size={getColSize(aside, isCompact)}>
        {aside()}
      </Col>
    );
  return (
    <Col className="Side-column" size={getColSize(aside, isCompact)}>
      {aside}
    </Col>
  );
};

export const TotalBalance = ({ consolidated, aside, isCompact, totalLabel = 'Total Balance' }) => {
  if (!isCompact) {
    return (
      <Col size={getColSize(aside, isCompact)} grow>
        <div className="Balance__Title">
          <div className="Balance__Title--label">{totalLabel}</div>
          <span className="Balance__Title--primary">{formatUsd(consolidated.total.usd)}</span>
          <span className="Balance__Title--secondary">
            {' '}
            {formatCurrency(consolidated.total.btc, { symbol: 'BTC' })}{' '}
          </span>
        </div>
      </Col>
    );
  }
  return null;
};

const getColSize = (aside, isCompact) => {
  if (aside && isCompact) return '4';
  if (isCompact && !aside) return '6';
  return '3';
};

const BalanceHeader = ({
  exchanges,
  selectedExchange,
  consolidated,
  selectExchange,
  aside,
  isCompact
}) => (
  <Row className={`Balance__Header ${isCompact ? 'compact' : ''}`}>
    <TotalBalance consolidated={consolidated} aside={aside} isCompact={isCompact} />
    <Col size={getColSize(aside, isCompact)}>
      <div className="Balance__Title-available">
        <div className="Balance__Title-available--label">Available Balance</div>
        <span className="Balance__Title-available--primary">
          {formatUsd(consolidated.available.usd)}
        </span>
        <span className="Balance__Title--secondary">
          {' '}
          {formatCurrency(consolidated.available.btc, { symbol: 'BTC' })}{' '}
        </span>
      </div>
    </Col>
    <Col size={getColSize(aside, isCompact)}>
      <div className="Balance__Title-reserved">
        <div className="Balance__Title-reserved--label">Reserved Balance</div>
        <span className="Balance__Title-available--primary">
          {formatUsd(consolidated.reserved.usd)}
        </span>
        <span className="Balance__Title--secondary">
          {' '}
          {formatCurrency(consolidated.reserved.btc, { symbol: 'BTC' })}{' '}
        </span>
      </div>
    </Col>
    {renderAside(aside)}
  </Row>
);

export default BalanceHeader;
