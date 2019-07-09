export const SELECT_TOP_COINS_QUOTE = 'SELECT_TOP_COINS_QUOTE';
export const SELECT_TOP_MARKETS_PAGE = 'SELECT_TOP_MARKETS_PAGE';
export const SELECT_EXCHANGE = 'CHANGE_SELECTED_EXCHANGE';
export const SELECT_TOP_MARKETS_SORTING = 'SELECT_TOP_MARKETS_SORTING';

export const SELECT_MARKETS_SORTING = 'SELECT_MARKETS_SORTING';

export const selectTopCoinsQuote = quote => ({
  type: SELECT_TOP_COINS_QUOTE,
  quote
});

export const selectTopMarketsPage = (quote, page) => ({
  type: SELECT_TOP_MARKETS_PAGE,
  quote,
  page
});

export const selectExchange = exchange => ({
  type: SELECT_EXCHANGE,
  exchange
});

export const selectTopMarketsSorting = settings => ({
  type: SELECT_TOP_MARKETS_SORTING,
  ...settings
});

export const selectMarketsSorting = settings => ({
  type: SELECT_MARKETS_SORTING,
  ...settings
});
