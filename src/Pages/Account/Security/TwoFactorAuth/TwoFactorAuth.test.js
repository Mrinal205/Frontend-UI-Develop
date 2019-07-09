import React from 'react';
import { shallow } from 'enzyme';
import { TwoFactorAuth } from './TwoFactorAuth';

it('renders <TwoFactorAuth /> component without crashing', () => {
  const mockTwoFactorAuthState = { meta: {} };
  const mockAccount = {};

  const wrapper = shallow(
    <TwoFactorAuth account={mockAccount} twoFactorAuth={mockTwoFactorAuthState} />
  );

  expect(wrapper.hasClass('TwoFactorAuth')).toBe(true);
});
