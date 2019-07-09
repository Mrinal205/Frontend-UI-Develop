import React from 'react';
import { shallow } from 'enzyme';
import { LoginPage } from './LoginPage';

it('renders LoginPage component without crashing', () => {
  const mockUser = { meta: {} };
  const login = <LoginPage user={mockUser} />;
  const wrapper = shallow(login);
  expect(wrapper.find('ReduxForm').length).toEqual(1);
});
