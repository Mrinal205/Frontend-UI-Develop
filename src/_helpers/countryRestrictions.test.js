import { isCoinbaseAllowedMarket } from './countryRestrictions';

describe('Country restrictions for Coinbase', () => {
  it('does not allow unlisted countries (eg. Russia)', () => {
    expect(isCoinbaseAllowedMarket('Russia', 'USD')).toBe(false);
    expect(isCoinbaseAllowedMarket('Russia', 'EUR')).toBe(false);
    expect(isCoinbaseAllowedMarket('Russia', 'GBP')).toBe(false);
    expect(isCoinbaseAllowedMarket('Russia', 'BTC')).toBe(false);
  });

  describe('USD trading', () => {
    const symbol = 'USD';

    it('does allow for US', () => {
      expect(isCoinbaseAllowedMarket('United States', symbol)).toBe(true);
    });

    it('does not allow for EU', () => {
      expect(isCoinbaseAllowedMarket('Germany', symbol)).toBe(false);
    });

    it('does not allow for UK', () => {
      expect(isCoinbaseAllowedMarket('United Kingdom', symbol)).toBe(false);
    });
  });

  describe('EUR trading', () => {
    const symbol = 'EUR';

    it('does not allow for US', () => {
      expect(isCoinbaseAllowedMarket('United States', symbol)).toBe(false);
    });

    it('does allow European countries', () => {
      expect(isCoinbaseAllowedMarket('Poland', symbol)).toBe(true);
      expect(isCoinbaseAllowedMarket('Netherlands', symbol)).toBe(true);
    });

    it('does allow for UK', () => {
      expect(isCoinbaseAllowedMarket('United Kingdom', symbol)).toBe(true);
    });
  });

  describe('GBP trading', () => {
    const symbol = 'GBP';

    it('does not allow for US', () => {
      expect(isCoinbaseAllowedMarket('United States', symbol)).toBe(false);
    });

    it('does not allow European countries', () => {
      expect(isCoinbaseAllowedMarket('Croatia', symbol)).toBe(false);
      expect(isCoinbaseAllowedMarket('Ireland', symbol)).toBe(false);
    });

    it('does allow for UK', () => {
      expect(isCoinbaseAllowedMarket('United Kingdom', symbol)).toBe(true);
    });
  });

  describe('BTC trading', () => {
    const symbol = 'BTC';

    it('does allow for US', () => {
      expect(isCoinbaseAllowedMarket('United States', symbol)).toBe(true);
    });

    it('does allow European countries', () => {
      expect(isCoinbaseAllowedMarket('Slovakia', symbol)).toBe(true);
      expect(isCoinbaseAllowedMarket('Switzerland', symbol)).toBe(true);
    });

    it('does allow for UK', () => {
      expect(isCoinbaseAllowedMarket('United Kingdom', symbol)).toBe(true);
    });

    it('does allow for Canada, Australia & Singapore', () => {
      ['Canada', 'Australia', 'Singapore'].forEach(country => {
        expect(isCoinbaseAllowedMarket(country, symbol)).toBe(true);
      });
    });
  });

  describe('USDC trading', () => {
    const symbol = 'USDC';

    it('does allow for US', () => {
      expect(isCoinbaseAllowedMarket('United States', symbol)).toBe(true);
    });

    it('does allow European countries', () => {
      expect(isCoinbaseAllowedMarket('Poland', symbol)).toBe(true);
    });

    it('does allow for UK', () => {
      expect(isCoinbaseAllowedMarket('United Kingdom', symbol)).toBe(true);
    });

    it('does allow for Canada, Australia & Singapore', () => {
      ['Canada', 'Australia', 'Singapore'].forEach(country => {
        expect(isCoinbaseAllowedMarket(country, symbol)).toBe(true);
      });
    });
  });
});
