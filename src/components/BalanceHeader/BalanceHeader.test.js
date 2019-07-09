import React from 'react';
import { shallow } from 'enzyme';
import BalanceHeader from './BalanceHeader';

it('renders <BalanceHeader /> component without crashing', () => {
  const props = {
    exchanges: ['BINANCE'],
    selectedExchange: 'BINANCE',
    consolidated: {
      available: { usd: 0, btc: 0 },
      total: { usd: 0, btc: 0 },
      reserved: { usd: 0, btc: 0 }
    }
  };
  const wrapper = shallow(<BalanceHeader {...props} />);
  expect(wrapper).toBeDefined();
});
