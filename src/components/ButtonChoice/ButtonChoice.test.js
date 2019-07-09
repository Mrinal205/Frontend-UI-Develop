import React from 'react';
import { shallow } from 'enzyme';
import ButtonChoice from './ButtonChoice';

describe('ButtonChoice', () => {
  it('should render the component without crashing', () => {
    const props = {
      input: {
        onChange: jest.fn()
      },
      values: ['limit', 'market']
    };

    const wrapper = shallow(<ButtonChoice {...props} />);
    expect(wrapper).toBeDefined();
  });
});
