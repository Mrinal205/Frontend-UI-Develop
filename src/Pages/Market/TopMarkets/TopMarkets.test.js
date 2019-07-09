import React from 'react';
import { shallow } from 'enzyme';
import TopMarkets from './TopMarkets';

it('renders TopMarkets Page without crashing', () => {
  const props = {
    selections: {
      quote: 'btc',
      topMarkets: {}
    },
    selectedExchange: {
      name: 'test'
    },
    quote: 'btc',
    sortedMarkets: {
      btc: []
    },
    history: {
      push: () => {}
    }
  };
  const wrapper = shallow(<TopMarkets {...props} />);
  expect(wrapper.find('.TopMarkets').length).toEqual(1);
});
