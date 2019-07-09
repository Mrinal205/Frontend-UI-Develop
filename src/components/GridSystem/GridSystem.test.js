import React from 'react';
import { shallow } from 'enzyme';
import { Container, Row, Col } from './GridSystem';

describe('Container', () => {
  it('renders its children', () => {
    const wrapper = shallow(
      <Container>
        <div className="foo">Foo</div>
      </Container>
    );
    expect(wrapper.find('.foo').length).toEqual(1);
  });
});

describe('Row', () => {
  it('renders its children', () => {
    const wrapper = shallow(
      <Row>
        <div className="foo">Foo</div>
        <div className="foo">Foo</div>
      </Row>
    );
    expect(wrapper.find('.foo').length).toEqual(2);
  });
});

describe('Col', () => {
  it('renders its children', () => {
    const wrapper = shallow(
      <Col>
        <span />
      </Col>
    );
    expect(wrapper.find('span').length).toEqual(1);
  });

  it('renders correct column size class', () => {
    const wrapper = shallow(<Col size="6" />);
    expect(wrapper.find('.Col--size-6').length).toEqual(1);
  });
});
