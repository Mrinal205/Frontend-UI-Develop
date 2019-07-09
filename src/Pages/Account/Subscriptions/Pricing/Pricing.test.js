import React from 'react';
import { shallow } from 'enzyme';
import Pricing from './Pricing';

it('renders <Pricing /> without crashing', () => {
  const wrapper = shallow(<Pricing />);
  expect(wrapper).toBeDefined();
});
