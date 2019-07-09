import React from 'react';
import { shallow } from 'enzyme';
import { RegisterForm } from './RegisterForm';

const mockStore = {
  subscribe: jest.fn(),
  dispatch: jest.fn(),
  getState: jest.fn()
};

it('renders RegisterForm component without crashing', () => {
  const wrapper = shallow(<RegisterForm />);
  expect(wrapper.find('.form').length).toEqual(1);
});

it('renders fullName field', () => {
  const wrapper = shallow(<RegisterForm />);
  expect(wrapper.find({ name: 'name' }).length).toEqual(1);
});

it('renders email field', () => {
  const wrapper = shallow(<RegisterForm />);
  expect(wrapper.find({ name: 'email' }).length).toEqual(1);
});

it('renders password field', () => {
  const wrapper = shallow(<RegisterForm />);
  expect(wrapper.find({ name: 'password' }).length).toEqual(1);
});
