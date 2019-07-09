import { scientificToDecimal } from './formatting';

describe('Formatting helpers', () => {
  const tests = [
    { num: 1e-5, expected: '0.00001' },
    { num: '1e-5', expected: '0.00001' },
    { num: 5e-5, expected: '0.00005' },
    { num: '5e-5', expected: '0.00005' },
    { num: 1.32e-8, expected: '0.0000000132' },
    { num: '1.32e-8', expected: '0.0000000132' }
  ];

  tests.forEach(({ num, expected }) => {
    it(`should format scientific notation to decimal - ${num}`, () => {
      expect(scientificToDecimal(num)).toEqual(expected);
    });
  });
});
