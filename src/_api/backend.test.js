import * as api from './backend';

describe('api', () => {
  it('fetches balance', () => {
    expect(api.getBalance).toBeDefined();
  });
});

describe('api', () => {
  it('fetches orders', () => {
    expect(api.getOrders).toBeDefined();
  });
});

describe('api', () => {
  it('cancel orders', () => {
    expect(api.deleteOrder).toBeDefined();
  });
});

describe('api', () => {
  it('submit orders', () => {
    expect(api.postOrder).toBeDefined();
  });
});
