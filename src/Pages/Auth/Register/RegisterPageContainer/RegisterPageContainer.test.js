import React from 'react';
import { shallow } from 'enzyme';
import { RegisterPageContainer } from './RegisterPageContainer';

describe('RegisterPageContainer', () => {
  const baseProps = {
    user: {},
    registerUserReset: jest.fn(),
    registerUser: jest.fn()
  };

  it('renders the component without crashing', () => {
    const wrapper = shallow(<RegisterPageContainer {...baseProps} />);
    expect(wrapper).toBeDefined();
  });

  it('redirects to "/" when user is logged in', () => {
    const props = {
      ...baseProps,
      user: {
        userId: 'some-id',
        accountId: 'any'
      }
    };

    const wrapper = shallow(<RegisterPageContainer {...props} />);
    const redirect = wrapper.find('Redirect');

    expect(redirect.length).toEqual(1);
    expect(redirect.prop('to')).toEqual('/');
  });
});
