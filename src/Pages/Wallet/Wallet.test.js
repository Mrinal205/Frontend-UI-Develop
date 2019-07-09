import React from 'react';
import { shallow } from 'enzyme';
import { Wallet } from './Wallet';

it('renders Wallet Page without crashing', () => {
  const props = {
    orders: {
      meta: {}
    },
    maxOrderPages: {}
  };
  const wrapper = shallow(<Wallet {...props} />);
  expect(wrapper).toBeDefined();
});
