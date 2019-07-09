import React from 'react';
import { shallow } from 'enzyme';
import { Button } from './Button';

describe('<Button />', () => {
  it('renders component without crashing', () => {
    const wrapper = shallow(<Button />);
    expect(wrapper).toBeDefined();
  });

  it('renders its contents', () => {
    const wrapper = shallow(<Button>text content</Button>);
    expect(wrapper.text()).toEqual('text content');
  });

  it('renders with additional css class', () => {
    const wrapper = shallow(<Button className="test-me" />);
    expect(wrapper.hasClass('test-me')).toBe(true);
  });

  it('supports danger style', () => {
    const wrapper = shallow(<Button danger />);
    expect(wrapper.hasClass('Button--danger')).toBe(true);
  });

  it('supports small style', () => {
    const wrapper = shallow(<Button small />);
    expect(wrapper.hasClass('Button--small')).toBe(true);
  });

  it('render Spinner when loading', () => {
    const wrapper = shallow(<Button loading />);
    expect(wrapper.find('Spinner')).toHaveLength(1);
  });
});
