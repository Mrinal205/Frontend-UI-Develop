import authErrorInterceptor from './authErrorInterceptor.js';

describe('authErrorInterceptor', () => {
  it('exposeses middleware function', () => {
    expect(authErrorInterceptor).toBeDefined();
  });

  // todo, improve
  it('calls logout action to intercept unauthorized response', () => {
    const thunk = jest.fn();

    expect(authErrorInterceptor(thunk)).toBeDefined();
  });
});
