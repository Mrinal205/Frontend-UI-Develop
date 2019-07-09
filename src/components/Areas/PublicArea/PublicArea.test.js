import React from 'react';
import { shallow } from 'enzyme';
import { PublicArea } from './PublicArea';

it('renders <PublicArea /> without crashing', () => {
  const props = {
    location: {
      pathname: '/auth/login'
    }
  };

  const wrapper = shallow(<PublicArea {...props} />);
  expect(wrapper.find('.PublicArea').length).toEqual(1);
});
