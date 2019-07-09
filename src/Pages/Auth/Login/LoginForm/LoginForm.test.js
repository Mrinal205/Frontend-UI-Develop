import React from 'react';
import { shallow } from 'enzyme';

import { LoginForm } from './LoginForm';

it('renders <LoginForm /> component without crashing', () => {
  const wrapper = shallow(<LoginForm />);
  expect(wrapper.find('form').length).toEqual(1);
});

it('renders email field', () => {
  const wrapper = shallow(<LoginForm />);
  expect(wrapper.find({ name: 'email' }).length).toEqual(1);
});

it('renders password field', () => {
  const wrapper = shallow(<LoginForm />);
  expect(wrapper.find({ name: 'password' }).length).toEqual(1);
});
