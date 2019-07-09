import React from 'react';
import { shallow } from 'enzyme';
import { MarketChart } from './MarketChart';

it('renders <MarketChart /> component without crashing', () => {
  window.TradingView = {
    widget: jest.fn(() => ({
      onChartReady: jest.fn()
    }))
  };

  const mockSymbol = 'gdax:BTC/USD';

  const wrapper = shallow(<MarketChart symbol={mockSymbol} />);
  expect(wrapper).toBeDefined();
});
