import TwoFactorAuthService from './twoFactorAuth.service';

describe('TwoFactorAuth Service', () => {
  const apiMethods = ['create', 'confirm', 'disable'];

  // smoke test for API methods
  apiMethods.forEach(name => {
    it(`provides ${name} function`, () => {
      expect(TwoFactorAuthService[name]).toBeDefined();
    });
  });
});
