import React from 'react';
import { shallow } from 'enzyme';
import { AdvancedMarketForm } from './AdvancedMarketForm';

describe('AdvancedMarketForm', () => {
  it('renders "AdvancedMarkets" form without crashing', () => {
    const props = {
      submitOrder: jest.fn(),
      selectedExchange: { exchangeName: 'BINANCE' },
      selectedMarket: {
        base: 'BTC',
        quote: 'USDT',
        precision: {
          base: 8,
          quote: 8,
          amount: 8,
          price: 8
        }
      },
      orderbook: {
        bids: [],
        asks: []
      },
      markets: {
        BINANCE: { 'BTC/USDT': {} }
      },
      balance: {},
      forms: {}
    };

    const wrapper = shallow(<AdvancedMarketForm {...props} />);
    expect(wrapper).toBeDefined();
  });
});
