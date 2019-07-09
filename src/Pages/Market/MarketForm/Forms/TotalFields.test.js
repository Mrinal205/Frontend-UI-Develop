import React from 'react';
import { shallow } from 'enzyme';
import TotalFields from './TotalFields';
import { noop } from 'lodash';

describe('TotalFields', () => {
  it('renders TotalFields without crashing', () => {
    const props = {
      formType: 'convert',
      handleSubmit: noop,
      selectedMarket: {
        base: 'BTC',
        quote: 'USDT',
        precision: { base: 4, quote: 5 }
      },
      form: 'StopLimitForm',
      initialValues: {},
      selectedExchange: { name: 'binance', coins: ['BTC'] },
      markets: {},
      formData: { values: { coin: 'BTC' } }
    };

    const wrapper = shallow(<TotalFields {...props} />);
    expect(wrapper).toBeDefined();
  });
});
