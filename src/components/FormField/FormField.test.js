import React from 'react';
import { shallow } from 'enzyme';
import { FormField, TextField, CheckBox } from './FormField';

describe('<FormField />', () => {
  it('renders a component without crashing', () => {
    const wrapper = shallow(<FormField />);
    expect(wrapper).toBeDefined();
  });

  describe('TextField', () => {
    it('renders field as a text input', () => {
      const wrapper = shallow(<FormField type="input" />);
      expect(wrapper.find('TextField')).toHaveLength(1);
    });

    it('renders TextField without crashing', () => {
      const props = {
        type: 'text',
        input: {
          name: 'foo'
        }
      };
      const wrapper = shallow(<TextField {...props} />);
      expect(wrapper).toBeDefined();
    });
  });

  describe('CheckBox', () => {
    it('renders field as a checkbox', () => {
      const wrapper = shallow(<FormField type="checkbox" />);
      expect(wrapper.find('CheckBox')).toHaveLength(1);
    });

    it('renders CheckBox without crashing', () => {
      const props = {
        type: 'checkbox',
        input: {
          name: 'foo'
        }
      };
      const wrapper = shallow(<CheckBox {...props} />);
      expect(wrapper).toBeDefined();
    });
  });
});
