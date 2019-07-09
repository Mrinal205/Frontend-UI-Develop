import { getMarkets, getMarketByName, getMarketQuotes, getFilteredMarkets } from './markets';

describe('markets selector', () => {
  const state = {
    markets: {
      BINANCE: {
        list: {
          'BTC/EUR': { symbol: 'BTC/EUR' },
          'BTC/USD': { symbol: 'BTC/USD' },
          'BTC/USDT': { symbol: 'BTC/USDT' },
          'BTC/GBP': { symbol: 'BTC/GBP' },
          'ETH/EUR': { symbol: 'ETH/EUR' },
          'ETH/USD': { symbol: 'ETH/USD' },
          'ETH/USDT': { symbol: 'ETH/USDT' },
          'ETH/GBP': { symbol: 'ETH/GBP' }
        }
      }
    }
  };

  it('returns markets', () => {
    expect(getMarkets(state)).toEqual(state.markets);
  });

  it('returns market by name market', () => {
    expect(getMarketByName(state, 'BTC/EUR', 'BINANCE')).toEqual({
      symbol: 'BTC/EUR',
      base: 'BTC',
      quote: 'EUR'
    });
  });

  it('returns market quotes', () => {
    const expected = ['EUR', 'USD', 'USDT', 'GBP'];
    expect(getMarketQuotes(state, 'BINANCE')).toEqual(expected);
  });

  it('returns market for quotes', () => {
    const expected = [{ symbol: 'BTC/EUR' }, { symbol: 'ETH/EUR' }];

    expect(getFilteredMarkets(state.markets.BINANCE, 'EUR')).toEqual(expected);
  });

  it('returns filtered market currencies', () => {
    const expected = [{ symbol: 'BTC/EUR' }];
    expect(getFilteredMarkets(state.markets.BINANCE, 'EUR', 'bt')).toEqual(expected);
  });
});
