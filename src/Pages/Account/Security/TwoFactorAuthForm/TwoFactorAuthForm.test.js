import React from 'react';
import { shallow } from 'enzyme';

import { TwoFactorAuthForm } from './TwoFactorAuthForm';

it('renders <TwoFactorAuthForm /> component without crashing', () => {
  const mocktwoFactorAuthState = { meta: {} };
  const wrapper = shallow(<TwoFactorAuthForm twoFactorAuth={mocktwoFactorAuthState} />);
  expect(wrapper.find('form').length).toEqual(1);
});

it('renders confirm field', () => {
  const mocktwoFactorAuthState = { meta: {} };
  const wrapper = shallow(<TwoFactorAuthForm twoFactorAuth={mocktwoFactorAuthState} />);
  expect(wrapper.find({ name: 'number' }).length).toEqual(1);
});
