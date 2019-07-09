import React from 'react';
import { shallow } from 'enzyme';

import { ConnectedExchanges } from './ConnectedExchanges';

describe('ConnectedExchanges component', () => {
  it('renders ConnectedExchanges component without crashing', () => {
    const props = {
      exchanges: [{ exchangeName: 'BINANCE', label: 'Binance', meta: { connected: true } }]
    };
    const wrapper = shallow(<ConnectedExchanges {...props} />);
    expect(wrapper).toBeDefined();
  });
});
