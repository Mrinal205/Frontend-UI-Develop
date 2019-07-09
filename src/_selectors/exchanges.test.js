import { getExchangeByName, getConnectedExchanges, connectedToExchange } from './exchanges';

describe('exchanges selector', () => {
  it('returns exchange by name', () => {
    const state = {
      exchanges: [
        { label: 'Binance', exchangeName: 'BINANCE', meta: {} },
        { label: 'Bittrex', exchangeName: 'BITTREX', meta: {} },
        { label: 'GDAX', exchangeName: 'GDAX', meta: {} }
      ]
    };

    const expected = {
      label: 'GDAX',
      exchangeName: 'GDAX',
      meta: {}
    };

    expect(getExchangeByName(state, 'GDAX')).toEqual(expected);
  });

  it("returns only a user's connected exchanges", () => {
    const state = {
      exchanges: [
        { label: 'Binance', exchangeName: 'BINANCE', meta: { connected: true } },
        { label: 'Bittrex', exchangeName: 'BITTREX', meta: {} },
        { label: 'Coinbase Pro', exchangeName: 'GDAX', meta: { connected: true } }
      ]
    };

    expect(getConnectedExchanges(state).length).toEqual(2);
  });

  it('returns true if the user is connected to a given exchange', () => {
    const state = {
      exchanges: [{ label: 'Binance', exchangeName: 'BINANCE', meta: { connected: true } }]
    };

    expect(connectedToExchange(state, 'BINANCE')).toEqual(true);
  });
});
