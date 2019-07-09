import {
  getTradingPair,
  isEmptyValue,
  formatMoney,
  formatCryptocurrency,
  safeNumericValue
} from './';

describe('Market helpers', () => {
  it('should return trading pair for a market symbol', () => {
    const market = {
      symbol: 'BTC/USD'
    };

    expect(getTradingPair(market)).toEqual({ base: 'BTC', quote: 'USD' });
  });
});

describe('Testing isEmptyValue', () => {
  it('should return false if value is not empty', () => {
    expect(isEmptyValue(34)).toEqual(false);
  });

  it('should return true if value is null', () => {
    expect(isEmptyValue(null)).toEqual(true);
  });

  it('should return true if value is empty string', () => {
    expect(isEmptyValue('')).toEqual(true);
  });

  it('should return true if value is undefined', () => {
    expect(isEmptyValue(undefined)).toEqual(true);
  });
});

describe('Testing formatMoney', () => {
  it('should return same value if not number', () => {
    expect(formatMoney(null)).toEqual(null);
  });

  it('should return formatted value if number', () => {
    expect(formatMoney(34)).toEqual('$34');
  });

  it('should return formatted value if number, limits to 2 decimals', () => {
    expect(formatMoney(34.73637)).toEqual('$34.74');
  });
});

describe('Testing safeNumericValue', () => {
  it('should return 0 if null', () => {
    expect(safeNumericValue(null)).toEqual(0);
  });

  it('should return 0 if not numeric string', () => {
    expect(safeNumericValue('test')).toEqual(0);
  });

  it('should return number if numeric string', () => {
    expect(safeNumericValue('34')).toEqual(34);
  });

  it('should return number if number', () => {
    expect(safeNumericValue(34.73637)).toEqual(34.73637);
  });
});

describe('Testing formatCryptocurrency', () => {
  it('should return same value if not number', () => {
    expect(formatCryptocurrency(null)).toEqual(null);
  });

  it('should return formatted value if number', () => {
    expect(formatCryptocurrency(34)).toEqual('34');
  });

  it('should return formatted value if number, limits to 8 decimals', () => {
    expect(formatCryptocurrency(34.7363748734873478)).toEqual('34.73637487');
  });

  it('should return formatted value if exponential number', () => {
    expect(formatCryptocurrency(7e-8)).toEqual('0.00000007');
  });
});
