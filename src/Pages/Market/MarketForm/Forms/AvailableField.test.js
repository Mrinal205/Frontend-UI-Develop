import React from 'react';
import { shallow } from 'enzyme';
import { AvailableField } from './AvailableField';

describe('AvailableField', () => {
  it('renders AvailableField without crashing', () => {
    const props = {
      currency: 'BTC',
      available: 1,
      selectedMarket: { precision: { base: 4, quote: 5 } },
      onClick: () => {},
      field: 'size'
    };

    const wrapper = shallow(<AvailableField {...props} />);
    expect(wrapper).toBeDefined();
  });
});
