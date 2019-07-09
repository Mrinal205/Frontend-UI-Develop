import React from 'react';
import { shallow } from 'enzyme';
import InlineLabel from './InlineLabel';

it('renders <InlineLabel /> component without crashing', () => {
  const wrapper = shallow(<InlineLabel />);
  expect(wrapper).toBeDefined();
});
