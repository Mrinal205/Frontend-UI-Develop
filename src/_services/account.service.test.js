import AccountService from './account.service';

describe('Account service', () => {
  const apiMethods = [
    'connectExchange',
    'disconnectExchange',
    'get',
    'update',
    'addSubscription',
    'removeSubscription'
  ];

  // smoke test for API methods ;-)
  apiMethods.forEach(name => {
    it(`provides ${name} function`, () => {
      expect(AccountService[name]).toBeDefined();
    });
  });
});
