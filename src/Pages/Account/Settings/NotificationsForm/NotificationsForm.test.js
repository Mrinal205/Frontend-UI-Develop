import React from 'react';
import { shallow } from 'enzyme';

import { NotificationsForm } from './NotificationsForm';
const mockEmailSubscriptions = [];

it('renders <NotificationsForm /> component without crashing', () => {
  const wrapper = shallow(<NotificationsForm emailSubscriptions={mockEmailSubscriptions} />);
  expect(wrapper.find('.form').length).toEqual(1);
});

it('renders newsletter notification field', () => {
  const wrapper = shallow(<NotificationsForm emailSubscriptions={mockEmailSubscriptions} />);

  expect(wrapper.find({ input: { name: 'notification_NEWSLETTER' } }).length).toEqual(1);
});

it('renders login notification field', () => {
  const wrapper = shallow(<NotificationsForm emailSubscriptions={mockEmailSubscriptions} />);
  expect(wrapper.find({ input: { name: 'notification_LOGIN' } }).length).toEqual(1);
});
