import React from 'react';
import { shallow } from 'enzyme';
import StepSelector from './StepSelector';

describe('StepSelector', () => {
  it('should render the component without crashing', () => {
    const props = {
      input: {
        value: '25%',
        onChange: jest.fn()
      }
    };
    const wrapper = shallow(<StepSelector {...props} />);
    expect(wrapper).toBeDefined();
  });
});
