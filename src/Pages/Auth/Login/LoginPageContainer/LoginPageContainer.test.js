import React from 'react';
import { shallow } from 'enzyme';
import { LoginPageContainer } from './LoginPageContainer';

const mockDispatch = jest.fn();

describe('LoginPageContainer', () => {
  const baseProps = {
    user: {},
    loginUserReset: jest.fn(),
    loginUser: jest.fn(),
    login2faUser: jest.fn()
  };

  it('renders the component without crashing', () => {
    const wrapper = shallow(<LoginPageContainer {...baseProps} />);
    expect(wrapper).toBeDefined();
  });

  it('redirects to "/" when user is logged in', () => {
    const props = {
      ...baseProps,
      user: {
        accountId: 'any-id'
      }
    };

    const wrapper = shallow(<LoginPageContainer {...props} />);
    const redirect = wrapper.find('Redirect');

    expect(redirect.length).toEqual(1);
    expect(redirect.prop('to')).toEqual('/');
  });
});
