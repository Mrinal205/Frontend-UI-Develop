import React from 'react';
import { shallow } from 'enzyme';

import Referral from './Referral';

it('renders <Referral /> component without crashing', () => {
  const wrapper = shallow(<Referral />);
  expect(wrapper).toBeDefined();
});
