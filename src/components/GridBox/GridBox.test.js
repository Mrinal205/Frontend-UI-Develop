import React from 'react';
import { shallow } from 'enzyme';
import { GridBox } from './GridBox';

it('renders its children without crashing', () => {
  const wrapper = shallow(
    <GridBox>
      <div className="foo">Foo</div>
    </GridBox>
  );
  expect(wrapper.find('.foo').length).toEqual(1);
});
