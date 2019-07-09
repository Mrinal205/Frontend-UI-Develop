import reducer from './trading.reducer';
import { actionNames, actionIds } from '../_actions/ids';
import { SELECT_ORDERBOOK_PRICE } from '_actions/orderbook.actions';
import { getFormId, OrderTypes, OfferTypes } from '_constants';

const initialState = {
  balance: {},
  forms: {},
  meta: {}
};

describe('trading balance reducer', () => {
  it('returns initial state', () => {
    expect(reducer(undefined, { meta: {} })).toEqual(initialState);
  });

  it('ignores dummy action type', () => {
    expect(reducer(initialState, { type: '@moon/DUMMY_ACTION' })).toEqual(initialState);
  });

  it('udpates balance on fetchBalance.success', () => {
    const action = {
      type: actionNames.fetchBalance.success,
      payload: {
        exchange: 'BINANCE',
        resp: {
          valuesMap: {
            BTC: { total: 1, reserved: 0, available: 1 },
            ETH: { total: 2, reserved: 1, available: 1 }
          }
        }
      }
    };

    const expectedState = {
      ...initialState,
      balance: {
        BINANCE: {
          BTC: { total: 1, reserved: 0, available: 1 },
          ETH: { total: 2, reserved: 1, available: 1 }
        }
      }
    };

    expect(reducer(initialState, action)).toEqual(expectedState);
  });
});

describe('Submit order reducer', () => {
  it('starts an order submission', () => {
    const action = {
      type: actionNames.submitOrder.request,
      payload: { form: 'test' }
    };
    const expectedState = {
      ...initialState,
      forms: {
        test: {
          orderSubmitting: true,
          orderSucceeded: false,
          orderError: null
        }
      }
    };
    expect(reducer(initialState, action)).toEqual(expectedState);
  });

  it('order submission succeeds', () => {
    const action = {
      type: actionNames.submitOrder.success,
      payload: { form: 'test' }
    };
    const expectedState = {
      ...initialState,
      balance: {},
      forms: {
        test: {
          orderSubmitting: false,
          orderSucceeded: true,
          size: 0,
          sizePercentage: 0,
          total: 0
        }
      }
    };
    expect(reducer(initialState, action)).toEqual(expectedState);
  });

  it('order submission fails', () => {
    const action = {
      type: actionNames.submitOrder.failure,
      payload: { form: 'test', error: { response: { data: { error: 'test error' } } } }
    };
    const expectedState = {
      ...initialState,
      balance: {},
      forms: {
        test: {
          orderSubmitting: false,
          orderError: 'Error rejected: test error'
        }
      }
    };
    expect(reducer(initialState, action)).toEqual(expectedState);
  });

  it('order rejected clientside', () => {
    const action = {
      type: actionIds.rejectOrder,
      payload: { form: 'test', error: 'test error' }
    };
    const expectedState = {
      ...initialState,
      balance: {},
      forms: {
        test: {
          orderError: 'test error'
        }
      },
      meta: {}
    };
    expect(reducer(initialState, action)).toEqual(expectedState);
  });
});

describe('Updating order forms state', () => {
  it('initialize order values', () => {
    const action = {
      type: actionIds.initializeOrderValues,
      payload: { form: 'test', values: { price: 1 } }
    };
    const expectedState = {
      ...initialState,
      balance: {},
      forms: {
        test: {
          price: 1
        }
      }
    };
    expect(reducer(initialState, action)).toEqual(expectedState);
  });

  it('select prices from orderbook', () => {
    const state = {
      ...initialState,
      forms: {
        [getFormId(OfferTypes.SELL, OrderTypes.LIMIT)]: { price: 0 },
        [getFormId(OfferTypes.BUY, OrderTypes.STOP)]: { stop: 0 },
        [getFormId(OfferTypes.CONVERT, OrderTypes.CONVERT)]: {}
      }
    };
    const action = {
      type: SELECT_ORDERBOOK_PRICE,
      payload: {
        price: 1,
        exchangeName: 'BINANCE'
      }
    };
    const expectedState = {
      ...initialState,
      forms: {
        [getFormId(OfferTypes.SELL, OrderTypes.LIMIT)]: { price: 1 },
        [getFormId(OfferTypes.BUY, OrderTypes.STOP)]: { stop: 1 },
        [getFormId(OfferTypes.CONVERT, OrderTypes.CONVERT)]: {}
      }
    };
    expect(reducer(state, action)).toEqual(expectedState);
  });

  it('initialize order values', () => {
    const action = {
      type: actionIds.initializeOrderValues,
      payload: { form: 'test', values: { price: 1 } }
    };
    const expectedState = {
      ...initialState,
      forms: {
        test: {
          price: 1
        }
      },
      meta: {}
    };
    expect(reducer(initialState, action)).toEqual(expectedState);
  });
});

describe('LIMIT order forms state', () => {
  /* ------------------------- LIMIT BUY --------------------------- */
  it('change price in limit buy', () => {
    const form = getFormId(OfferTypes.BUY, OrderTypes.LIMIT);
    const state = {
      balance: {
        BINANCE: {
          BTC: { total: 1, reserved: 0, available: 1 },
          ETH: { total: 2, reserved: 1, available: 1 }
        }
      },
      forms: {
        [form]: { price: 0, total: 0, size: '1', sizePercentage: 100, availableCoin: 'ETH' }
      }
    };
    const action = {
      type: actionIds.changeOrderValue,
      payload: { form, value: 0.5, field: 'price', exchangeName: 'BINANCE' }
    };
    const expectedState = {
      ...state,
      forms: {
        [form]: { price: 0.5, total: 0.5, size: '1', sizePercentage: 50, availableCoin: 'ETH' }
      }
    };
    expect(reducer(state, action)).toEqual(expectedState);
  });

  it('change size in limit buy', () => {
    const form = getFormId(OfferTypes.BUY, OrderTypes.LIMIT);
    const state = {
      balance: {
        BINANCE: {
          BTC: { total: 1, reserved: 0, available: 1 },
          ETH: { total: 2, reserved: 1, available: 1 }
        }
      },
      forms: {
        [form]: { price: 0.5, total: 0.5, size: '1', sizePercentage: 50, availableCoin: 'ETH' }
      }
    };
    const action = {
      type: actionIds.changeOrderValue,
      payload: { form, value: 2, field: 'size', exchangeName: 'BINANCE' }
    };

    const expectedState = {
      ...state,
      forms: {
        [form]: { price: 0.5, total: 1, size: '2', sizePercentage: 100, availableCoin: 'ETH' }
      }
    };
    expect(reducer(state, action)).toEqual(expectedState);
  });

  it('change size percentage in limit buy', () => {
    const form = getFormId(OfferTypes.BUY, OrderTypes.LIMIT);
    const state = {
      balance: {
        BINANCE: {
          BTC: { total: 1, reserved: 0, available: 1 },
          ETH: { total: 2, reserved: 1, available: 1 }
        }
      },
      forms: {
        [form]: { price: 0.5, total: 0.5, size: '1', sizePercentage: 50, availableCoin: 'ETH' }
      }
    };
    const action = {
      type: actionIds.changeOrderValue,
      payload: { form, value: 100, field: 'sizePercentage', exchangeName: 'BINANCE', precision: 8 }
    };

    const expectedState = {
      ...state,
      forms: {
        [form]: {
          price: 0.5,
          total: 1,
          size: '2.00000000',
          sizePercentage: 100,
          availableCoin: 'ETH'
        }
      }
    };
    expect(reducer(state, action)).toEqual(expectedState);
  });

  /* ------------------------- LIMIT SELL --------------------------- */
  it('change price in limit sell', () => {
    const form = getFormId(OfferTypes.SELL, OrderTypes.LIMIT);
    const state = {
      balance: {
        BINANCE: {
          BTC: { total: 1, reserved: 0, available: 1 },
          ETH: { total: 2, reserved: 1, available: 1 }
        }
      },
      forms: {
        [form]: { price: 0, total: 0, size: '1', sizePercentage: 100, availableCoin: 'ETH' }
      }
    };
    const action = {
      type: actionIds.changeOrderValue,
      payload: { form, value: 0.5, field: 'price', exchangeName: 'BINANCE' }
    };

    const expectedState = {
      ...state,
      forms: {
        [form]: { price: 0.5, total: 0.5, size: '1', sizePercentage: 100, availableCoin: 'ETH' }
      }
    };
    expect(reducer(state, action)).toEqual(expectedState);
  });

  it('change size in limit sell', () => {
    const form = getFormId(OfferTypes.SELL, OrderTypes.LIMIT);
    const state = {
      balance: {
        BINANCE: {
          BTC: { total: 1, reserved: 0, available: 1 },
          ETH: { total: 2, reserved: 1, available: 1 }
        }
      },
      forms: {
        [form]: { price: 0.5, total: 0.5, size: '1', sizePercentage: 50, availableCoin: 'ETH' }
      }
    };
    const action = {
      type: actionIds.changeOrderValue,
      payload: { form, value: 2, field: 'size', exchangeName: 'BINANCE' }
    };

    const expectedState = {
      ...state,
      forms: {
        [form]: { price: 0.5, total: 1, size: '2', sizePercentage: 200, availableCoin: 'ETH' }
      }
    };
    expect(reducer(state, action)).toEqual(expectedState);
  });

  it('change size percentage in limit sell', () => {
    const form = getFormId(OfferTypes.SELL, OrderTypes.LIMIT);
    const state = {
      balance: {
        BINANCE: {
          BTC: { total: 1, reserved: 0, available: 1 },
          ETH: { total: 2, reserved: 1, available: 1 }
        }
      },
      forms: {
        [form]: { price: 0.5, total: 0.5, size: '1', sizePercentage: 50, availableCoin: 'ETH' }
      }
    };
    const action = {
      type: actionIds.changeOrderValue,
      payload: { form, value: 100, field: 'sizePercentage', exchangeName: 'BINANCE' }
    };

    const expectedState = {
      ...state,
      forms: {
        [form]: { price: 0.5, total: 0.5, size: '1', sizePercentage: 100, availableCoin: 'ETH' }
      }
    };
    expect(reducer(state, action)).toEqual(expectedState);
  });
});

describe('MARKET order forms state', () => {
  /* ------------------------- MARKET BUY --------------------------- */
  it('change size in market buy', () => {
    const form = getFormId(OfferTypes.BUY, OrderTypes.MARKET);
    const state = {
      balance: {
        BINANCE: {
          BTC: { total: 1, reserved: 0, available: 1 },
          ETH: { total: 2, reserved: 1, available: 1 }
        }
      },
      forms: {
        [form]: { price: 0.5, total: 0.5, size: '1', sizePercentage: 50, availableCoin: 'ETH' }
      }
    };
    const action = {
      type: actionIds.changeOrderValue,
      payload: { form, value: 2, field: 'size', bestMarketPrice: 1, exchangeName: 'BINANCE' }
    };

    const expectedState = {
      ...state,
      forms: {
        [form]: { price: 1, total: 2, size: '2', sizePercentage: 200, availableCoin: 'ETH' }
      }
    };
    expect(reducer(state, action)).toEqual(expectedState);
  });

  it('change size percentage in limit buy', () => {
    const form = getFormId(OfferTypes.BUY, OrderTypes.MARKET);
    const state = {
      balance: {
        BINANCE: {
          BTC: { total: 1, reserved: 0, available: 1 },
          ETH: { total: 2, reserved: 1, available: 1 }
        }
      },
      forms: {
        [form]: { price: 0.5, total: 0.5, size: '1', sizePercentage: 50, availableCoin: 'ETH' }
      }
    };
    const action = {
      type: actionIds.changeOrderValue,
      payload: {
        form,
        value: 100,
        field: 'sizePercentage',
        bestMarketPrice: 1,
        exchangeName: 'BINANCE',
        precision: 8
      }
    };

    const expectedState = {
      ...state,
      forms: {
        [form]: {
          price: 1,
          total: 1,
          size: '1.00000000',
          sizePercentage: 100,
          availableCoin: 'ETH'
        }
      }
    };
    expect(reducer(state, action)).toEqual(expectedState);
  });

  /* ------------------------- MARKET SELL --------------------------- */
  it('change size in market sell', () => {
    const form = getFormId(OfferTypes.SELL, OrderTypes.MARKET);
    const state = {
      balance: {
        BINANCE: {
          BTC: { total: 1, reserved: 0, available: 1 },
          ETH: { total: 2, reserved: 1, available: 1 }
        }
      },
      forms: {
        [form]: { price: 0.5, total: 0.5, size: '1', sizePercentage: 50, availableCoin: 'ETH' }
      }
    };
    const action = {
      type: actionIds.changeOrderValue,
      payload: { form, value: 2, field: 'size', bestMarketPrice: 1, exchangeName: 'BINANCE' }
    };

    const expectedState = {
      ...state,
      forms: {
        [form]: { price: 1, total: 2, size: '2', sizePercentage: 200, availableCoin: 'ETH' }
      }
    };
    expect(reducer(state, action)).toEqual(expectedState);
  });

  it('change size percentage in limit sell', () => {
    const form = getFormId(OfferTypes.SELL, OrderTypes.MARKET);
    const state = {
      balance: {
        BINANCE: {
          BTC: { total: 1, reserved: 0, available: 1 },
          ETH: { total: 2, reserved: 1, available: 1 }
        }
      },
      forms: {
        [form]: { price: 0.5, total: 0.5, size: '1', sizePercentage: 50, availableCoin: 'ETH' }
      }
    };
    const action = {
      type: actionIds.changeOrderValue,
      payload: {
        form,
        value: 100,
        field: 'sizePercentage',
        bestMarketPrice: 1,
        exchangeName: 'BINANCE'
      }
    };

    const expectedState = {
      ...state,
      forms: {
        [form]: { price: 1, total: 1, size: '1', sizePercentage: 100, availableCoin: 'ETH' }
      }
    };
    expect(reducer(state, action)).toEqual(expectedState);
  });
});
