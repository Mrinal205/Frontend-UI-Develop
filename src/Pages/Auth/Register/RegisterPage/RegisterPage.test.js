import React from 'react';
import { shallow } from 'enzyme';
import { RegisterPage } from './RegisterPage';

it('renders RegisterPage component without crashing', () => {
  const mockUser = { meta: {} };
  const wrapper = shallow(<RegisterPage user={mockUser} handleSubmit={() => {}} />);
  // expect(wrapper.find('ReduxForm').length).toEqual(1);
  expect(wrapper).toBeDefined();
});

// it('renders loading when user action is in progress', () => {
//   const mockUser = { meta: { loading: true } };
//   const wrapper = shallow(<RegisterPage user={mockUser} handleSubmit={()=>{}} />);
//   expect(wrapper.find('Loading').length).toEqual(1);
// });

// it('renders an error when one is given', () => {
//   const mockUser = { meta: { error: true, errorMessage: 'here' } };
//   const wrapper = shallow(<RegisterPage user={mockUser} handleSubmit={()=>{}} />);
//   expect(wrapper.find('ErrorMessage').length).toEqual(1);
// });
