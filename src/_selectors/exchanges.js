import _ from 'lodash';

export const getExchangeByName = (state, exchangeName) => {
  return _.find(state.exchanges, { exchangeName: exchangeName.toUpperCase() });
};

export const getConnectedExchanges = state => {
  return state.exchanges.filter(ex => ex.meta.connected);
};

export const connectedToExchange = (state, exchangeName) =>
  getConnectedExchanges(state).some(ex => ex.exchangeName === exchangeName);

export const getAvailableExchanges = state => {
  return state.exchanges.filter(exchange => exchange.meta.connected !== true);
};
