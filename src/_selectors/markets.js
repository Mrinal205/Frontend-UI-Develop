import { createSelector } from 'reselect';
import _ from 'lodash';
import { Order, DefaultMarketSorting } from '_constants';
import { getTradingPair } from '_helpers';

export const getMarkets = state => state.markets;
export const getMarketsByExchange = (state, exchangeName) =>
  state.markets[exchangeName] || { list: {}, meta: {} };
export const getSelectedExchangeName = (state, exchangeName) => exchangeName;
export const getSelections = state => state.selections;
/**
 * Returns market by name
 * @param {Object} state
 * @param {String} marketName
 */
export const getMarketByName = (state, marketName, exchangeName) => {
  const market = _.get(state.markets, `${exchangeName}.list.${marketName}`);
  return !market
    ? market
    : {
        ...market,
        ...getTradingPair(market)
      };
};

/**
 * Returns only quote currency values for market list (used in dropdown filtering)
 */
export const getMarketQuotes = createSelector([getMarketsByExchange], markets => {
  if (!markets) {
    return [];
  }

  const { list } = markets;
  return _.uniq(
    Object.keys(list).map(key => {
      const pairs = key.split('/');
      return pairs[1];
    })
  );
});

export const getMarketsByPairQuote = createSelector([getMarketsByExchange], markets => {
  if (!markets) {
    return {};
  }

  const { list } = markets;
  return Object.keys(list).reduce((prev, pair) => {
    const pairQuote = pair.split('/')[1];
    if (prev[pairQuote]) {
      prev[pairQuote].push(list[pair]);
    } else {
      prev[pairQuote] = [list[pair]];
    }
    return prev;
  }, {});
});

export const getSortedMarketsByPairQuote = createSelector(
  [getMarketsByPairQuote, getSelections],
  (markets, selections) => {
    const { topMarkets } = selections.marketOverview;

    Object.keys(markets).forEach(quote => {
      const { sortBy = DefaultMarketSorting, order = Order.DESC } = topMarkets[quote] || {};

      markets[quote] = [
        ...markets[quote].sort((a, b) => {
          return order === Order.DESC ? b[sortBy] - a[sortBy] : a[sortBy] - b[sortBy];
        })
      ];
    });

    return { ...markets };
  }
);

export const getTopCoinsByVolume = createSelector(
  [getMarketsByPairQuote, getSelections],
  (markets, selections) => {
    const { quote } = selections.marketOverview;
    if (!markets[quote]) {
      return [];
    }

    // Temp filter to remove CMCT from charts
    const bittrexFilter = market => market.symbol.indexOf('CMCT') === -1;

    return markets[quote]
      .slice()
      .filter(bittrexFilter)
      .sort((a, b) => b[DefaultMarketSorting] - a[DefaultMarketSorting])
      .slice(0, 4);
  }
);

/**
 * Returns list of markets, filtered by target quote and base string
 * TODO: As it is not really a clean REDUX selector, consider refactoring
 * See: https://github.com/reactjs/reselect/blob/master/README.md#q-how-do-i-create-a-selector-that-takes-an-argument
 *
 * @param {Array} markets
 * @param {String} filterQuote
 * @param {String} filterBaseString
 */
export const getFilteredMarkets = (markets, filterQuote, filterBaseString = '') => {
  if (markets === undefined) {
    return [];
  }

  const { list } = markets;
  let results = _.filter(list, f => f.symbol && f.symbol.split('/')[1] === filterQuote);
  if (filterBaseString.length > 0) {
    const search = filterBaseString.toUpperCase();
    results = _.filter(results, f => f.symbol.split('/')[0].indexOf(search) > -1);
  }
  return results;
};
