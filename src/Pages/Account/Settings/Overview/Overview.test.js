import React from 'react';
import { shallow } from 'enzyme';
import { Overview } from './Overview';

const mockAccount = { accountId: 'some-id' };

it('renders <Overview /> without crashing', () => {
  const wrapper = shallow(<Overview user={{ email: '' }} />);

  expect(wrapper).toBeDefined();
});
