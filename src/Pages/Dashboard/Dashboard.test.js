import React from 'react';
import { shallow } from 'enzyme';
import Dashboard from './Dashboard';

it('renders Dashboard Page without crashing', () => {
  const props = {
    orders: {
      meta: {},
      orders: []
    },
    maxOrderPages: {}
  };

  const wrapper = shallow(<Dashboard {...props} />);
  expect(wrapper).toBeDefined();
});
