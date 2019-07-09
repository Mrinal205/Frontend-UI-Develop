import React from 'react';
import { shallow } from 'enzyme';
import Exchanges from './Exchanges';

it('renders Exchanges component without crashing', () => {
  const wrapper = shallow(<Exchanges />);
  expect(wrapper).toBeDefined();
});

it('renders list of connected account exchanges', () => {
  const mockExchanges = [
    { exchangeName: 'Exchange #0', meta: {} },
    { exchangeName: 'Exchange #1', meta: {} },
    { exchangeName: 'Exchange #2', meta: {} },
    {
      exchangeName: 'Exchange #3',
      apiKey: 'some-key-***',
      apiSecred: 'some-secret-***',
      meta: {}
    }
  ];
  const wrapper = shallow(<Exchanges exchanges={mockExchanges} />);

  expect(wrapper.find('.AccountExchanges__item').length).toBe(mockExchanges.length);
});
