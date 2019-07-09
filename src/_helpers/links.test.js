import * as links from './links';

describe('getMarketUrl link', () => {
  it('Creates a valid link', () => {
    const link = links.getMarketUrl('BINANCE', 'BTC/USD');
    expect(link).toEqual('/market/BINANCE/BTC-USD');
  });
});
