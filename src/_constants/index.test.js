import { API_HOST, TICKER_API_HOST } from './index';

describe('constants', () => {
  it('defines API_HOST', () => {
    expect(API_HOST).toBeDefined();
  });

  it('defines TICKER_API_HOST', () => {
    expect(TICKER_API_HOST).toBeDefined();
  });
});
