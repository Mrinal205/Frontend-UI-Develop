import configureStore from './configureStore';

describe('store', () => {
  it('configures the store', () => {
    const store = configureStore();

    const keys = ['dispatch', 'subscribe', 'getState', 'replaceReducer'];

    keys.forEach(key => {
      expect(store[key]).toBeDefined();
    });
  });
});
