import { getMarketInfoBySymbol } from './marketInfo.js';

describe('Market Info SELECTORS', () => {
  const state = {
    markets: {
      BINANCE: {
        list: {},
        'BNB/BTC': {
          limits: { amount: { min: 0.01, max: 90000 } }
        }
      }
    }
  };

  it('returns marketInfo for the given symbol and exchange', () => {
    expect(getMarketInfoBySymbol(state, 'BINANCE', 'BNB/BTC')).toEqual(
      state.markets.BINANCE['BNB/BTC']
    );
  });
});
