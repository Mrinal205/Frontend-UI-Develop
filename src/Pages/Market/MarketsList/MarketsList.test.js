import React from 'react';
import { shallow } from 'enzyme';
import { MarketsList } from './MarketsList';

it('renders <MarketsList /> component without crashing', () => {
  const mockExchange = {
    exchangeName: 'GDAX'
  };

  const mockMarkets = {
    list: [],
    meta: {}
  };

  const mockHistory = {
    match: {}
  };

  const mockQuotes = [];

  const mockSelections = {};

  const wrapper = shallow(
    <MarketsList
      selectedExchange={mockExchange}
      selections={mockSelections}
      history={mockHistory}
      markets={mockMarkets}
      quotes={mockQuotes}
    />
  );
  expect(wrapper).toBeDefined();
});
