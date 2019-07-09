import React from 'react';
import { shallow } from 'enzyme';
import { MarketTrades } from './MarketTrades';

it('renders <MarketTrades /> component without crashing', () => {
  const mockTrades = {
    list: [],
    meta: {}
  };

  const wrapper = shallow(<MarketTrades trades={mockTrades} />);
  expect(wrapper).toBeDefined();
});
