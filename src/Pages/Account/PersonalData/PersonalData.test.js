import React from 'react';
import { shallow } from 'enzyme';
import { PersonalData } from './PersonalData';

it('renders <PersonalData /> component without crashing', () => {
  const mockUser = { userId: 'some-user-id', accountId: 'some-account-id' };
  const mockAccount = { accountId: 'some-id' };
  const mockDispatch = jest.fn();

  const wrapper = shallow(
    <PersonalData user={mockUser} account={mockAccount} dispatch={mockDispatch} />
  );
  expect(wrapper).toBeDefined();
});
