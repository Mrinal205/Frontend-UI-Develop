import React from 'react';
import { shallow } from 'enzyme';
import { Select } from './Select';

it('renders Select without crashing', () => {
  const wrapper = shallow(<Select className="Select--moon" />);
  expect(wrapper.find('.Select--moon').length).toEqual(1);
});
