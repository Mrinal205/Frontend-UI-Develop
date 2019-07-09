import React from 'react';
import { shallow } from 'enzyme';
import { GenericMarketForm } from './GenericMarketForm';

describe('GenericMarketForm', () => {
  const baseProps = {
    offerType: 'buy',
    orderType: 'limit',
    fields: [],
    form: 'buy-limit',
    submitOrder: jest.fn(),
    initializeOrderValues: jest.fn(),
    initialValues: {},
    selectedExchange: {
      exchangeName: 'BINANCE'
    },
    selectedMarket: {
      base: 'BTC',
      quote: 'USDT',
      symbol: 'BTC/USD',
      maker: 0,
      taker: 0.003,
      precision: {
        amount: 8
      }
    },
    sendFields: {},
    orderbook: {
      bids: [],
      asks: []
    },
    markets: {},
    balance: {},
    forms: {},
    validations: []
  };

  it('renders "GenericMarketForm" form without crashing', () => {
    const props = {
      ...baseProps
    };

    const wrapper = shallow(<GenericMarketForm {...props} />);
    expect(wrapper).toBeDefined();
  });

  describe('with submit order', () => {
    it('correctly handles order submit for LIMIT buy', () => {
      const props = {
        ...baseProps,
        form: 'buy-limit',
        formData: {
          size: 2.0,
          price: 10000,
          total: 20000
        },
        offerType: 'buy',
        orderType: 'limit',
        sendFields: {
          amount: 'size',
          price: 'price'
        },
        submitOrder: jest.fn()
      };

      const wrapper = shallow(<GenericMarketForm {...props} />);
      wrapper.find('.MarketForm__submit').simulate('click');

      expect(props.submitOrder).toHaveBeenCalledWith({
        form: props.form,
        order: {
          exchangeName: props.selectedExchange.exchangeName,
          symbolPair: props.selectedMarket.symbol,
          offerType: 'BUY',
          orderType: 'LIMIT',
          amount: '1.99400000',
          originalAmount: props.formData.size,
          price: props.formData.price
        }
      });
    });

    it('correctly handles order submit for LIMIT sell', () => {
      const props = {
        ...baseProps,
        form: 'sell-limit',
        formData: {
          size: 2.0,
          price: 10000,
          total: 20000
        },
        offerType: 'sell',
        orderType: 'limit',
        sendFields: {
          amount: 'size',
          price: 'price'
        },
        submitOrder: jest.fn()
      };

      const wrapper = shallow(<GenericMarketForm {...props} />);
      wrapper.find('.MarketForm__submit').simulate('click');

      expect(props.submitOrder).toHaveBeenCalledWith({
        form: props.form,
        order: {
          exchangeName: props.selectedExchange.exchangeName,
          symbolPair: props.selectedMarket.symbol,
          offerType: 'SELL',
          orderType: 'LIMIT',
          amount: props.formData.size,
          price: props.formData.price
        }
      });
    });

    it('correctly handles order submit for MARKET buy', () => {
      const props = {
        ...baseProps,
        form: 'buy-market',
        formData: {
          size: 3.0,
          price: 10000,
          total: 30000
        },
        offerType: 'buy',
        orderType: 'market',
        sendFields: {
          amount: 'size'
        },
        submitOrder: jest.fn()
      };

      const wrapper = shallow(<GenericMarketForm {...props} />);
      wrapper.find('.MarketForm__submit').simulate('click');

      expect(props.submitOrder).toHaveBeenCalledWith({
        form: props.form,
        order: {
          exchangeName: props.selectedExchange.exchangeName,
          symbolPair: props.selectedMarket.symbol,
          offerType: 'BUY',
          orderType: 'MARKET',
          amount: '2.99100000',
          originalAmount: props.formData.size
        }
      });
    });

    it('correctly handles order submit for MARKET sell', () => {
      const props = {
        ...baseProps,
        form: 'sell-market',
        formData: {
          size: 2.5,
          price: 10000,
          total: 25000
        },
        offerType: 'buy',
        orderType: 'market',
        sendFields: {
          amount: 'size'
        },
        submitOrder: jest.fn()
      };

      const wrapper = shallow(<GenericMarketForm {...props} />);
      wrapper.find('.MarketForm__submit').simulate('click');

      expect(props.submitOrder).toHaveBeenCalledWith({
        form: props.form,
        order: {
          exchangeName: props.selectedExchange.exchangeName,
          symbolPair: props.selectedMarket.symbol,
          offerType: 'BUY',
          orderType: 'MARKET',
          amount: 2.5
        }
      });
    });
  });
});
