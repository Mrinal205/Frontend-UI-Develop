import * as api from './index';

describe('api', () => {
  it('fetches markets', () => {
    expect(api.getMarkets).toBeDefined();
  });

  it('fetches ticker', () => {
    expect(api.getTicker).toBeDefined();
  });

  it('fetches candlesticks', () => {
    expect(api.getCandleSticks).toBeDefined();
  });

  it('fetches trades', () => {
    expect(api.getTrades).toBeDefined();
  });

  it('fetches orderbook', () => {
    expect(api.getOrderBook).toBeDefined();
  });
});
