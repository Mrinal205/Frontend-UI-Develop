import React from 'react';
import { shallow } from 'enzyme';
import { Exchanges } from './Exchanges';

describe('<Exchanges /> component', () => {
  it('renders Exchanges view without crashing', () => {
    const wrapper = shallow(<Exchanges />);
    expect(wrapper).toBeDefined();
  });
});
