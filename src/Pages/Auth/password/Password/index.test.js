import React from 'react';
import { shallow } from 'enzyme';
import Password from './view';

it('renders Password component without crashing', () => {
  const wrapper = shallow(<Password user={{ meta: {} }} />);
  expect(wrapper).toBeDefined();
});
