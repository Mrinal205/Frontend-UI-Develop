import React from 'react';
import { shallow } from 'enzyme';
import EmailPass from './EmailPass';

const mockUser = { email: 'user@example.com' };

it('renders <EmailPass /> without crashing', () => {
  const wrapper = shallow(<EmailPass user={mockUser} />);

  expect(wrapper.hasClass('EmailPass')).toEqual(true);
});
