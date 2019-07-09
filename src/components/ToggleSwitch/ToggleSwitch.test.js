import React from 'react';
import { shallow } from 'enzyme';
import ToggleSwitch from './ToggleSwitch';

describe('ToggleSwitch', () => {
  it('should render the component without crashing', () => {
    const props = {
      input: {
        value: true,
        onChange: jest.fn()
      }
    };
    const wrapper = shallow(<ToggleSwitch {...props} />);
    expect(wrapper).toBeDefined();
  });
});
