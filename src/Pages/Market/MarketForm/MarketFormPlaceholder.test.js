import React from 'react';
import { shallow } from 'enzyme';
import { MarketFormPlaceholder } from './MarketFormPlaceholder';

describe('MarketFormPlaceholder', () => {
  it('render "MarketFormPlaceholder" without crashing', () => {
    const wrapper = shallow(<MarketFormPlaceholder />);
    expect(wrapper).toBeDefined();
  });
});
