import React from 'react';
import { shallow } from 'enzyme';
import HelpTooltip from './HelpTooltip';

describe('<HelpTooltip />', () => {
  it('renders component without crashing', () => {
    const wrapper = shallow(<HelpTooltip />);
    expect(wrapper).toBeDefined();
  });
});
