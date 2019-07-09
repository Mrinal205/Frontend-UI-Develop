import React from 'react';
import { shallow } from 'enzyme';
import { Hint } from './Hint';

it('renders <Hint /> component without crashing', () => {
  const wrapper = shallow(<Hint />);
  expect(wrapper).toBeDefined();
});
