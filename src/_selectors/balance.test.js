import { consolidatedBalance, consolidatedValueBalance } from './balance';

const state = {
  trading: {
    balance: {
      BINANCE: {
        BTC: { total: 1, reserved: 0, available: 1 },
        ETH: { total: 2, reserved: 1, available: 1 }
      },
      GDAX: {
        BTC: { total: 1, reserved: 1, available: 0 },
        LTC: { total: 2, reserved: 1, available: 1 }
      }
    }
  },
  exchanges: [
    {
      exchangeName: 'GDAX',
      label: 'Coinbase Pro',
      coins: [
        {
          base: 'BTC',
          quotes: ['USD', 'EUR']
        },
        {
          base: 'LTC',
          quotes: ['BTC']
        }
      ]
    },
    {
      exchangeName: 'BINANCE',
      label: 'Binance',
      coins: [
        {
          base: 'BTC',
          quotes: ['USDT', 'EUR']
        },
        {
          base: 'ETH',
          quotes: ['BTC', 'USDT']
        }
      ]
    }
  ],
  markets: {
    BINANCE: {
      list: {
        'BTC/USDT': { price: 10000 },
        'ETH/USDT': { price: 500 },
        'ETH/BTC': { price: 0.05 }
      }
    },
    GDAX: {
      list: {
        'BTC/USD': { price: 9500 },
        'LTC/BTC': { price: 0.001 }
      }
    }
  }
};

describe('consolidated balance', () => {
  it('returns balance by exchange', () => {
    const expected = [
      {
        exchange: 'GDAX',
        exchangeLabel: 'Coinbase Pro',
        coin: 'BTC',
        total: 1,
        reserved: 1,
        available: 0,
        quotes: ['USD', 'EUR'],
        name: 'Bitcoin'
      },
      {
        exchange: 'GDAX',
        exchangeLabel: 'Coinbase Pro',
        coin: 'LTC',
        total: 2,
        reserved: 1,
        available: 1,
        quotes: ['BTC'],
        name: 'Litecoin'
      }
    ];

    expect(consolidatedBalance(state, { exchangeName: 'GDAX' })).toEqual(expected);
  });
});

describe('consolidated balance', () => {
  it('returns balance of all exchanges', () => {
    const expected = [
      {
        exchange: 'BINANCE',
        exchangeLabel: 'Binance',
        coin: 'BTC',
        total: 1,
        reserved: 0,
        available: 1,
        quotes: ['USDT', 'EUR'],
        name: 'Bitcoin'
      },
      {
        exchange: 'BINANCE',
        exchangeLabel: 'Binance',
        coin: 'ETH',
        total: 2,
        reserved: 1,
        available: 1,
        quotes: ['BTC', 'USDT'],
        name: 'Ethereum'
      },
      {
        exchange: 'GDAX',
        exchangeLabel: 'Coinbase Pro',
        coin: 'BTC',
        total: 1,
        reserved: 1,
        available: 0,
        quotes: ['USD', 'EUR'],
        name: 'Bitcoin'
      },
      {
        exchange: 'GDAX',
        exchangeLabel: 'Coinbase Pro',
        coin: 'LTC',
        total: 2,
        reserved: 1,
        available: 1,
        quotes: ['BTC'],
        name: 'Litecoin'
      }
    ];

    expect(consolidatedBalance(state, { exchangeName: 'ALL' })).toEqual(expected);
  });
});

describe('consolidatedValueBalance balance', () => {
  it('returns balance with value for all exchanges', () => {
    const expected = {
      balance: [
        {
          exchange: 'BINANCE',
          exchangeLabel: 'Binance',
          coin: 'BTC',
          total: '1.00000000',
          reserved: 0,
          available: 1,
          quotes: ['USDT', 'EUR'],
          name: 'Bitcoin',
          usdValue: '$10,000.00',
          btcValue: '1.00000000 BTC'
        },
        {
          exchange: 'GDAX',
          exchangeLabel: 'Coinbase Pro',
          coin: 'BTC',
          total: '1.00000000',
          reserved: 1,
          available: 0,
          quotes: ['USD', 'EUR'],
          name: 'Bitcoin',
          usdValue: '$9,500.00',
          btcValue: '1.00000000 BTC'
        },
        {
          exchange: 'BINANCE',
          exchangeLabel: 'Binance',
          coin: 'ETH',
          total: '2.00000000',
          reserved: 1,
          available: 1,
          quotes: ['BTC', 'USDT'],
          name: 'Ethereum',
          usdValue: '$1,000.00',
          btcValue: '0.10000000 BTC'
        },
        {
          exchange: 'GDAX',
          exchangeLabel: 'Coinbase Pro',
          coin: 'LTC',
          total: '2.00000000',
          reserved: 1,
          available: 1,
          quotes: ['BTC'],
          name: 'Litecoin',
          usdValue: '$19.00',
          btcValue: '0.00200000 BTC'
        }
      ],
      consolidated: {
        available: {
          btc: 1.051,
          usd: 10509.5
        },
        reserved: {
          btc: 1.051,
          usd: 10009.5
        },
        total: {
          btc: 2.102,
          usd: 20519
        }
      },
      totalUSD: 20519,
      totalBTC: 2.102
    };

    expect(consolidatedValueBalance(state, { exchangeName: 'ALL' })).toEqual(expected);
  });
});
