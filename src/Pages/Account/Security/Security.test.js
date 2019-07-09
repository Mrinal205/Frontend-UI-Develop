import React from 'react';
import { shallow } from 'enzyme';
import { Security } from './Security';

it('renders <Security /> component without crashing', () => {
  const wrapper = shallow(<Security user={{}} account={{}} />);
  expect(wrapper.find('h1').length).toEqual(1);
});

it('renders <LoginHistory /> component on page', () => {
  const wrapper = shallow(<Security user={{}} account={{}} />);
  expect(wrapper.find('LoginHistory').length).toEqual(1);
});
