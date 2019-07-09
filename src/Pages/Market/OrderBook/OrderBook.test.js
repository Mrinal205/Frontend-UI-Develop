import React from 'react';
import { shallow } from 'enzyme';
import { OrderBook } from './OrderBook';

it('renders <OrderBook /> component without crashing', () => {
  const mockProps = {
    orderbook: {
      asks: [[110, 1]],
      bids: [[109, 0.1]],
      page: {},
      meta: {}
    },
    selectedExchange: {
      exchangeName: 'GDAX'
    },
    selectedMarket: {
      symbol: 'BTC/USD',
      precision: {
        total: 8,
        amount: 8,
        base: 8,
        price: 8,
        quote: 8
      }
    },
    selectOrderbookPrecision: jest.fn()
  };

  const wrapper = shallow(<OrderBook {...mockProps} />);
  expect(wrapper).toBeDefined();
});
