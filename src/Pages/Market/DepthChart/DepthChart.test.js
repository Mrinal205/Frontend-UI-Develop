import React from 'react';
import { mount } from 'enzyme';
import { DepthChart } from './DepthChart';

describe('DepthChart', () => {
  it('renders "DepthChart" form without crashing', () => {
    const props = {
      market: {
        price: 1500
      },
      orderbook: {
        bids: [[1000, 10], [1100, 9], [1200, 8]],
        asks: [[2000, 10], [1900, 9], [1200, 8]]
      }
    };

    const wrapper = mount(<DepthChart {...props} />);
    expect(wrapper).toBeDefined();
  });
});
