import React from 'react';
import { shallow } from 'enzyme';

import { AddExchangeForm } from './AddExchangeForm';
const mockAccount = { meta: {} };
const mockExchange = {
  exchangeName: 'TEST',
  meta: {}
};

it('renders <AddExchangeForm /> component without crashing', () => {
  const props = {
    availableExchanges: [{ exchangeName: 'BINANCE', label: 'Binance', meta: {} }],
    resetExchangeForm: jest.fn()
  };

  const wrapper = shallow(<AddExchangeForm {...props} />);
  expect(wrapper.find('form').length).toEqual(1);
});
