import React from 'react';
import { shallow } from 'enzyme';
import Profile from './Profile';

it('renders Profile component without crashing', () => {
  const mockAccount = {
    accountId: 'test-id',
    name: 'John Doe'
  };

  const mockUser = {
    email: 'jd@example.org'
  };

  const wrapper = shallow(<Profile account={mockAccount} user={mockUser} />);

  expect(wrapper).toBeDefined();
});
