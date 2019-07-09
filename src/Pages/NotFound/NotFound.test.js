import React from 'react';
import { shallow } from 'enzyme';
import { NotFound } from './NotFound';

it('renders NotFound Page without crashing', () => {
  const wrapper = shallow(<NotFound />);
  expect(wrapper).toBeDefined();
});
