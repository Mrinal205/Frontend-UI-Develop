import React from 'react';
import { shallow } from 'enzyme';
import { AccountSummary } from './AccountSummary';

it('renders <AccountSummary /> component without crashing', () => {
  const mockUser = { userId: 'some-user-id', accountId: 'some-account-id' };
  const mockAccount = { accountId: 'some-id' };
  const mockExchanges = [];
  const wrapper = shallow(
    <AccountSummary user={mockUser} account={mockAccount} exchanges={mockExchanges} />
  );
  expect(wrapper).toBeDefined();
});
