import React from 'react';
import { shallow } from 'enzyme';
import { Subscriptions } from './Subscriptions';

it('renders <Subscriptions /> without crashing', () => {
  const wrapper = shallow(<Subscriptions />);
  expect(wrapper).toBeDefined();
});
