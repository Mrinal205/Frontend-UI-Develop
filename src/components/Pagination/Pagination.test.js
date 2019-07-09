import React from 'react';
import { shallow } from 'enzyme';
import Pagination from './Pagination';

it('Pagination renders without crashing', () => {
  const props = {
    currentPage: 0,
    totalPages: 2
  };

  const wrapper = shallow(<Pagination {...props} />);

  expect(wrapper.length).toEqual(1);
});
