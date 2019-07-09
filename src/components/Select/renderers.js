import React from 'react';
import { getCurrency } from '_helpers';

export const coinSelectValueRenderer = coin => (
  <div className="Select-value-label-container">
    <span className="Select-value-label-coin">{coin.value}</span>
    <span className="Select-value-label-currency">{getCurrency(coin.value)}</span>
  </div>
);
