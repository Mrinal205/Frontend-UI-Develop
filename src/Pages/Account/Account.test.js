import React from 'react';
import { shallow } from 'enzyme';
import { Account } from './Account';

it('renders Account Page without crashing', () => {
  const props = {
    user: {
      accountId: '1234-5678'
    },
    getAccount: jest.fn(),
    dispatch: jest.fn()
  };

  const wrapper = shallow(<Account {...props} />);
  expect(wrapper).toBeDefined();
});
