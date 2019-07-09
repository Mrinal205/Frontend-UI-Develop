import React from 'react';
import { shallow } from 'enzyme';
import { MarketDetails } from './MarketDetails';

it('renders Market Page without crashing', () => {
  const wrapper = shallow(<MarketDetails />);
  expect(wrapper.find('.MarketDetails').length).toEqual(1);
});
