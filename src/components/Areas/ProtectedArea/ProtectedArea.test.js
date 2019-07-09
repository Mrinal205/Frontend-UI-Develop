import React from 'react';
import { shallow } from 'enzyme';
import { ProtectedArea } from './ProtectedArea';

describe('ProtectedArea component', () => {
  const props = {
    user: {
      userId: 'some-user-id',
      accountId: 'some-account-id'
    },
    account: {
      meta: {}
    },
    getAccount: jest.fn(),
    location: {
      pathname: '/'
    }
  };

  it('renders ProtectedArea without crashing', () => {
    const wrapper = shallow(<ProtectedArea {...props} />);
    expect(wrapper).toBeDefined();
  });

  it('gets account on component mount', () => {
    props.getAccount.mockReset();
    shallow(<ProtectedArea {...props} />);
    expect(props.getAccount.mock.calls.length).toBe(1);
  });
});
