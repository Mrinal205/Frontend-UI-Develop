import React from 'react';
import { shallow } from 'enzyme';
import Spinner from './Spinner';

it('renders Spinner without crashing', () => {
  const wrapper = shallow(<Spinner />);
  expect(wrapper.find('.Spinner').length).toBe(1);
});
