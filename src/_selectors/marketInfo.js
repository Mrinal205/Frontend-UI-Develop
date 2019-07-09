import { createSelector } from 'reselect';

export const getMarketInfoBySymbol = (state, exchangeName, symbol) =>
  state.markets[exchangeName] && state.markets[exchangeName][symbol]
    ? state.markets[exchangeName][symbol]
    : null;

export const getMarketInfo = createSelector([getMarketInfoBySymbol], info => info);
export const getMarketLimits = createSelector(
  [getMarketInfoBySymbol],
  info => (info ? info.limits : null)
);
