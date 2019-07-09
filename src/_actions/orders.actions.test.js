jest.mock('_helpers/rpc');
import { createPeriodicalRPCAction, createRPCAction } from '_helpers/rpc';
import { postOrder, getOrders, deleteOrder } from '_api/backend';
import { rpcIds, actionIds } from '_actions/ids';

import { submitOrder, setCurrentTradingMarket, fetchOrders, cancelOrder } from './orders.actions';

describe('submitOrder action', () => {
  it('must dispacth action', () => {
    const payload = { order: 'order', form: 'form' };
    const dispacth = jest.fn().mockReturnValue(Promise.resolve(true));
    submitOrder(payload)(dispacth);
    expect(createRPCAction).toHaveBeenCalledTimes(1);
    expect(createRPCAction).toHaveBeenCalledWith(rpcIds.submitOrder, postOrder, payload);
  });
});

describe('fetchOrders action', () => {
  it('must dispacth action', () => {
    createPeriodicalRPCAction.mockReset();
    fetchOrders('BINANCE', 'ETH-BTC');
    expect(createPeriodicalRPCAction).toHaveBeenCalledTimes(1);
    const call =
      createPeriodicalRPCAction.mock.calls[createPeriodicalRPCAction.mock.calls.length - 1];
    expect(call[0]).toEqual(rpcIds.fetchOrders);
    expect(call[1]).toEqual(getOrders);
    expect(call[2]).toEqual({ exchangeName: 'BINANCE', symbol: 'ETH-BTC' });
    expect(typeof call[3]).toEqual('function');
  });
});

describe('setCurrentTradingMarket action', () => {
  it('must dispacth action', () => {
    const expected = {
      type: actionIds.setCurrentTradingMarket,
      meta: { field: 'selectedMarket' },
      payload: { market: 'market' }
    };
    const actual = setCurrentTradingMarket({ market: 'market' });
    expect(expected).toEqual(actual);
  });
});

describe('cancelOrder action', () => {
  it('must dispacth action', () => {
    createRPCAction.mockReset();
    const payload = { order: 'order', exchangeName: 'BINANCE', symbol: 'ETH/BTC' };
    const dispacth = jest.fn().mockReturnValue(Promise.resolve(true));
    cancelOrder('order', 'BINANCE', 'ETH/BTC')(dispacth);
    expect(createRPCAction).toHaveBeenCalledTimes(1);
    expect(createRPCAction).toHaveBeenCalledWith(rpcIds.cancelOrder, deleteOrder, payload);
  });
});
