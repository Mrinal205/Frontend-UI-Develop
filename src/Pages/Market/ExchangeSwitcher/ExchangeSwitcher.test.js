import React from 'react';
import { shallow } from 'enzyme';
import { ExchangeSwitcher } from './ExchangeSwitcher';

describe('ExchangeSwitcher', () => {
  const mockExchanges = [
    { name: 'Binance', exchangeName: 'BINANCE' },
    { name: 'GDAX', exchangeName: 'GDAX' }
  ];

  it('renders <ExchangeSwitcher /> component without crashing', () => {
    const mockSelectedExchange = {
      name: 'Kucoin',
      exchangeName: 'KUCOIN',
      lastActivity: {}
    };

    const wrapper = shallow(
      <ExchangeSwitcher selectedExchange={mockSelectedExchange} exchanges={mockExchanges} />
    );

    expect(wrapper).toBeDefined();
  });

  it('renders green activity indicator', () => {
    const selectedExchange = {
      name: 'Gdax',
      exchangeName: 'GDAX',
      lastActivity: {
        marketTicker: new Date().getTime() - 10 * 1000,
        orderBook: new Date().getTime() - 2 * 1000,
        trades: new Date().getTime() - 30 * 1000
      }
    };

    const wrapper = shallow(
      <ExchangeSwitcher
        selectedExchange={selectedExchange}
        exchanges={mockExchanges}
        showIndicator
      />
    );

    expect(
      wrapper
        .dive()
        .find('HelpTip')
        .dive()
        .find('.ExchangeSwitcher__indicator--all')
    ).toHaveLength(1);
  });
});
