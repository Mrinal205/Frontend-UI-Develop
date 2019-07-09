import React from 'react';
import { shallow } from 'enzyme';
import { VerificationPage } from './VerificationPage';

describe('VerificationPage component', () => {
  it('renders the component without crashing', () => {
    const props = {
      location: {
        search: '&foo=1&bar=2'
      },
      user: {
        email: 'moon@example.com',
        meta: {}
      }
    };

    const wrapper = shallow(<VerificationPage {...props} />);
    expect(wrapper.find('.PublicArea__message')).toHaveLength(1);
  });

  it('dispatches an action when location contain verification params', () => {
    const props = {
      location: {
        search: '?userId=test&code=1234'
      },
      user: {
        meta: {}
      },
      verifyUser: jest.fn()
    };

    const wrapper = shallow(<VerificationPage {...props} />);

    expect(props.verifyUser).toHaveBeenCalled();
  });
});
