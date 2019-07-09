import React from 'react';
import { shallow } from 'enzyme';
import { Page } from './Page';

it('renders <Page /> children', () => {
  const wrapper = shallow(
    <Page>
      <div>Foo</div>
    </Page>
  );
  expect(wrapper.find('div').length).toEqual(1);
});

it('renders <Page /> title correctly', () => {
  const wrapper = shallow(<Page title="Test page" />);
  expect(wrapper.find('title').text()).toEqual('Test page - Moon Assist');
});
