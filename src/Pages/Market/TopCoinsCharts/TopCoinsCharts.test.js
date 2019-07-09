import React from 'react';
import { shallow } from 'enzyme';
import TopCoinsCharts from './TopCoinsCharts';

it('renders TopCoinsCharts Page without crashing', () => {
  const props = {
    selections: {
      quote: 'btc'
    },
    selectedExchange: {
      name: 'test'
    },
    quote: 'btc',
    coins: []
  };
  const wrapper = shallow(<TopCoinsCharts {...props} />);
  expect(wrapper.find('.TopCoinsCharts').length).toEqual(1);
});
