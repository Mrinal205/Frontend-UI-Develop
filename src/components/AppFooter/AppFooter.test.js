import React from 'react';
import { shallow } from 'enzyme';
import { AppFooter } from './AppFooter';

it('renders AppFooter without crashing', () => {
  const wrapper = shallow(<AppFooter />);
  expect(wrapper.find('.AppFooter').length).toBe(1);
});
