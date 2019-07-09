import * as actions from './selections.actions';

describe('Selection actions', () => {
  it('Selects the currency for the top quotes', () => {
    const expectedAction = {
      type: actions.SELECT_TOP_COINS_QUOTE,
      quote: 'btc'
    };

    expect(actions.selectTopCoinsQuote('btc')).toEqual(expectedAction);
  });

  it('Selects a visible page number for top markets', () => {
    const expectedAction = {
      type: actions.SELECT_TOP_MARKETS_PAGE,
      quote: 'btc',
      page: 1
    };

    expect(actions.selectTopMarketsPage('btc', 1)).toEqual(expectedAction);
  });

  it('Set sorting settings for top markets', () => {
    const expectedAction = {
      type: actions.SELECT_TOP_MARKETS_SORTING,
      quote: 'btc',
      sortBy: 'price',
      order: 'desc'
    };

    expect(
      actions.selectTopMarketsSorting({ quote: 'btc', sortBy: 'price', order: 'desc' })
    ).toEqual(expectedAction);
  });

  it('Changes the selected exchange', () => {
    const mockExchange = {
      exchangeName: 'Test'
    };

    const expectedAction = {
      type: actions.SELECT_EXCHANGE,
      exchange: {
        ...mockExchange
      }
    };

    expect(actions.selectExchange(mockExchange)).toEqual(expectedAction);
  });
});
