import { consolidatedOrders, paginatedOrders, paginatedOrdersByMarket } from './orders';

const state = {
  orders: {
    BINANCE: {
      open: [{ timestamp: 1 }, { timestamp: 2 }],
      closed: [
        { timestamp: 3 },
        { timestamp: 4 },
        { timestamp: 5 },
        { timestamp: 6 },
        { timestamp: 7 },
        { timestamp: 8 },
        { timestamp: 9 },
        { timestamp: 10 }
      ]
    },
    GDAX: {
      open: [{ timestamp: 11 }],
      closed: [{ timestamp: 12 }, { timestamp: 13 }]
    },
    meta: {}
  },
  exchanges: [
    { exchangeName: 'GDAX', label: 'Coinbase Pro' },
    { exchangeName: 'BINANCE', label: 'Binance' }
  ]
};

describe('consolidatedOrders selector', () => {
  it('returns orders by exchange', () => {
    const expected = {
      meta: {},
      openOrders: [{ name: 'GDAX', timestamp: 11 }],
      closedOrders: [{ name: 'GDAX', timestamp: 13 }, { name: 'GDAX', timestamp: 12 }]
    };

    expect(consolidatedOrders(state, { exchangeName: 'GDAX' })).toEqual(expected);
  });
});

describe('consolidatedOrders selector', () => {
  it('returns orders for all exchanges', () => {
    const expected = {
      meta: {},
      openOrders: [
        { name: 'GDAX', timestamp: 11 },
        { name: 'BINANCE', timestamp: 2 },
        { name: 'BINANCE', timestamp: 1 }
      ],
      closedOrders: [
        { name: 'GDAX', timestamp: 13 },
        { name: 'GDAX', timestamp: 12 },
        { name: 'BINANCE', timestamp: 10 },
        { name: 'BINANCE', timestamp: 9 },
        { name: 'BINANCE', timestamp: 8 },
        { name: 'BINANCE', timestamp: 7 },
        { name: 'BINANCE', timestamp: 6 },
        { name: 'BINANCE', timestamp: 5 },
        { name: 'BINANCE', timestamp: 4 },
        { name: 'BINANCE', timestamp: 3 }
      ]
    };

    expect(consolidatedOrders(state, { exchangeName: 'ALL' })).toEqual(expected);
  });
});

describe('paginatedOrders selector', () => {
  it('returns orders for all exchanges', () => {
    const expected = {
      openOrders: [
        { name: 'GDAX', timestamp: 11 },
        { name: 'BINANCE', timestamp: 2 },
        { name: 'BINANCE', timestamp: 1 }
      ],
      closedOrders: [
        { name: 'GDAX', timestamp: 13 },
        { name: 'GDAX', timestamp: 12 },
        { name: 'BINANCE', timestamp: 10 },
        { name: 'BINANCE', timestamp: 9 },
        { name: 'BINANCE', timestamp: 8 },
        { name: 'BINANCE', timestamp: 7 }
      ],
      maxOrderPages: {
        open: 1,
        closed: 2
      }
    };

    expect(paginatedOrders(state, { exchangeName: 'ALL' })).toEqual(expected);
  });
});

describe('paginatedOrders selector', () => {
  it('paginates to second page', () => {
    const newState = {
      orders: {
        ...state.orders,
        meta: {
          closedOrdersPage: 1
        }
      },
      exchanges: [
        { exchangeName: 'GDAX', label: 'Coinbase Pro' },
        { exchangeName: 'BINANCE', label: 'Binance' }
      ]
    };

    const expected = {
      openOrders: [
        { name: 'GDAX', timestamp: 11 },
        { name: 'BINANCE', timestamp: 2 },
        { name: 'BINANCE', timestamp: 1 }
      ],
      closedOrders: [
        { name: 'BINANCE', timestamp: 6 },
        { name: 'BINANCE', timestamp: 5 },
        { name: 'BINANCE', timestamp: 4 },
        { name: 'BINANCE', timestamp: 3 }
      ],
      maxOrderPages: {
        open: 1,
        closed: 2
      }
    };

    expect(paginatedOrders(newState, { exchangeName: 'ALL' })).toEqual(expected);
  });
});

describe('paginatedOrdersByMarket selector', () => {
  it('paginates correctly', () => {
    const newState = {
      orders: {
        meta: {},
        BINANCE: {
          'ETH/BTC': {
            open: [1, 2, 3],
            closed: [4, 5, 6, 7, 8, 9, 10, 11]
          }
        }
      }
    };

    const expected = {
      openOrders: [1, 2, 3],
      closedOrders: [4, 5, 6, 7, 8, 9],
      maxOrderPages: {
        open: 1,
        closed: 2
      }
    };

    expect(paginatedOrdersByMarket(newState, { exchangeName: 'BINANCE' }, 'ETH/BTC')).toEqual(
      expected
    );
  });
});
