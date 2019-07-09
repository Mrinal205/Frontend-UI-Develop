import React from 'react';
import { shallow } from 'enzyme';
import { Shakeable } from './Shakeable';

it('renders Shakeable without crashing', () => {
  const wrapper = shallow(<Shakeable />);
  expect(wrapper).toBeDefined();
});

it('renders its Children correctly', () => {
  const wrapper = shallow(
    <Shakeable>
      <h1>Test node</h1>
    </Shakeable>
  );
  expect(wrapper.find('h1').length).toBe(1);
});

it('renders correct CSS class when should shake', () => {
  const wrapper = shallow(<Shakeable />);
  expect(wrapper.hasClass('animated')).toEqual(false);

  wrapper.setProps({ shouldShake: true });
  expect(wrapper.hasClass('animated')).toEqual(true);
  expect(wrapper.hasClass('shake')).toEqual(true);
});

it('resets the state after shake animation has ended', () => {
  const wrapper = shallow(<Shakeable shouldShake={true} />);
  wrapper.simulate('animationEnd');
  expect(wrapper.state('shake')).toEqual(false);
});
