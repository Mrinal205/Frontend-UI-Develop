import React from 'react';
import { shallow } from 'enzyme';
import { Application } from './Application';

describe('Application', () => {
  const baseProps = {
    restoreUser: jest.fn()
  };

  it('renders Application without crashing', () => {
    const props = {
      ...baseProps
    };

    const wrapper = shallow(<Application {...props} />);
    expect(wrapper).toBeDefined();
  });

  it('restores user when Application is mounted', () => {
    const props = {
      ...baseProps
    };

    const wrapper = shallow(<Application {...props} />);
    expect(props.restoreUser).toHaveBeenCalled();
  });
});
