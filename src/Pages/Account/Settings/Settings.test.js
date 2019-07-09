import React from 'react';
import { shallow } from 'enzyme';
import { Settings } from './Settings';

const mockAccount = { accountId: 'some-id' };

it('renders <Settings /> without crashing', () => {
  const wrapper = shallow(<Settings match={{ path: '/' }} store={{}} />);

  expect(wrapper).toBeDefined();
});
