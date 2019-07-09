import React from 'react';
import { mount } from 'enzyme';
import { CoinLineChart } from './CoinLineChart';

it('CoinLineChart renders without crashing and fetches candlesticks', () => {
  const fetchCandlesticks = jest.fn();
  const props = {
    fetchCandlesticks,
    candlesticks: []
  };

  const wrapper = mount(<CoinLineChart {...props} />);

  expect(wrapper.length).toEqual(1);
  expect(fetchCandlesticks.mock.calls.length).toBe(1);
});
