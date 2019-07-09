import React from 'react';
import { shallow } from 'enzyme';
import { Form } from './Form';

const mockAccount = {
  meta: {}
};

it('renders <Form /> component without crashing', () => {
  const wrapper = shallow(<Form account={mockAccount} />);
  expect(wrapper.find('.form').length).toEqual(1);
});

it('renders PersonalDatails section of the form', () => {
  const wrapper = shallow(<Form account={mockAccount} />);

  expect(wrapper.find('PersonalDatails').length).toEqual(1);
});

it('renders Address section of the form', () => {
  const wrapper = shallow(<Form account={mockAccount} />);

  expect(wrapper.find('Address').length).toEqual(1);
});

it('renders Success message when form was updated', () => {
  const wrapper = shallow(<Form account={{ meta: { updated: true } }} />);
  expect(wrapper.find('Hint').filter({ type: 'success' }).length).toEqual(1);
});
