import React from 'react';
import { shallow } from 'enzyme';
import Email from './view';
const mockDispatch = jest.fn();

it('renders Email component without crashing', () => {
  const wrapper = shallow(<Email dispatch={mockDispatch} user={{ meta: {} }} />);
  expect(wrapper).toBeDefined();
});
