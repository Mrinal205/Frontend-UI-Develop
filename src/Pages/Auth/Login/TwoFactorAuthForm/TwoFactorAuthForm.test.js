import React from 'react';
import { shallow } from 'enzyme';

import { TwoFactorAuthForm } from './TwoFactorAuthForm';

it('renders <TwoFactorAuthForm /> component without crashing', () => {
  const wrapper = shallow(<TwoFactorAuthForm />);
  expect(wrapper.find('form').length).toEqual(1);
});

it('renders numer field', () => {
  const wrapper = shallow(<TwoFactorAuthForm />);
  expect(wrapper.find({ name: 'number' }).length).toEqual(1);
});
