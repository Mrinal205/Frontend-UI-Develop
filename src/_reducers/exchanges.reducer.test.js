import exchanges from './exchanges.reducer';
import * as actions from '../_actions/exchanges.actions';
import { subscribeMarketSuccess } from '_actions/markets.actions';

describe('exchanges reducer', () => {
  it('returns initial state', () => {
    const expectedInitialState = [
      { label: 'Binance', exchangeName: 'BINANCE', meta: {}, lastActivity: {} },
      { label: 'Bittrex', exchangeName: 'BITTREX', meta: {}, lastActivity: {} },
      {
        label: 'Coinbase Pro',
        exchangeName: 'GDAX',
        extraPassphrase: true,
        meta: {},
        lastActivity: {}
      }
      // { label: 'Kraken', exchangeName: 'KRAKEN', meta: {}, lastActivity: {} },
      // { label: 'Kucoin', exchangeName: 'KUCOIN', meta: {}, lastActivity: {} },
      // { label: 'Poloniex', exchangeName: 'POLONIEX', meta: {}, lastActivity: {} }
    ];

    expect(exchanges(undefined, {})).toEqual(expectedInitialState);
  });

  describe('connecting exchanges', () => {
    it('returns correct state for CONNECT_EXCHANGE_REQUEST action', () => {
      const initialState = [
        { label: 'Bittrex', exchangeName: 'BITTREX', meta: {} },
        { label: 'Coinbase Pro', exchangeName: 'GDAX', meta: {} }
      ];
      const expectedState = [
        { label: 'Bittrex', exchangeName: 'BITTREX', meta: {} },
        { label: 'Coinbase Pro', exchangeName: 'GDAX', meta: { connecting: true } }
      ];

      const exchangeToConnect = { exchangeName: 'GDAX' };

      expect(exchanges(initialState, actions.connectExchangeRequest(exchangeToConnect))).toEqual(
        expectedState
      );
    });

    it('returns correct state for CONNECT_EXCHANGE_SUCCESS action', () => {
      const initialState = [
        { label: 'Bittrex', exchangeName: 'BITTREX', meta: {} },
        { label: 'Coinbase Pro', exchangeName: 'GDAX', meta: {} }
      ];
      const expectedState = [
        { label: 'Bittrex', exchangeName: 'BITTREX', meta: { connected: true } },
        { label: 'Coinbase Pro', exchangeName: 'GDAX', meta: {} }
      ];

      const exchangeToConnect = { exchangeName: 'BITTREX' };
      expect(exchanges(initialState, actions.connectExchangeSuccess(exchangeToConnect))).toEqual(
        expectedState
      );
    });
  });

  describe('exchange activity status', () => {
    it('resets activity on market change', () => {
      const initialState = [
        {
          label: 'Bittrex',
          exchangeName: 'BITTREX',
          meta: {},
          lastActivity: {
            marketTicker: 1534534640,
            orderBook: 1534534641,
            trades: 1534534642
          }
        },
        {
          label: 'Coinbase Pro',
          exchangeName: 'GDAX',
          meta: {}
        }
      ];

      const newState = exchanges(initialState, subscribeMarketSuccess('BITTREX'));

      expect(newState[0].lastActivity).toEqual({});
    });
  });
});
