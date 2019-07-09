import React from 'react';
import { shallow } from 'enzyme';
import AdvancedMarketFormContainer from './AdvancedMarketFormContainer';

describe('AdvancedMarketFormContainer', () => {
  it('renders  without crashing', () => {
    const props = {
      formType: 'buy',
      selectedMarket: {
        symbol: 'BTC/USDT'
      },
      selectedExchange: {
        exchangeName: 'BINANCE'
      },
      store: {
        subscribe: jest.fn(),
        dispatch: jest.fn(),
        getState: () => ({
          orderbook: {
            asks: [],
            bids: []
          },
          markets: {
            BINANCE: { list: { 'BTC/USDT': {} } }
          },
          trading: {
            balance: {},
            forms: {
              'marketForm-buy': {
                values: {}
              }
            }
          }
        })
      }
    };

    const wrapper = shallow(<AdvancedMarketFormContainer {...props} />);
    expect(wrapper).toBeDefined();
  });
});
