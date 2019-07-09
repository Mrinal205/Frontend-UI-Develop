import { fetchBalance } from './balance.actions';
import { getBalance } from '_api/backend';
import * as rpc from '_helpers/rpc';

describe('fetchBalance action', () => {
  it('must dispacth action', () => {
    rpc.createRPCAction = jest.fn();
    fetchBalance('exchange', 'markets');
    expect(rpc.createRPCAction).toHaveBeenCalledTimes(1);
    expect(rpc.createRPCAction).toHaveBeenCalledWith('fetchBalance', getBalance, {
      exchange: 'exchange',
      markets: 'markets'
    });
  });

  it('must serialize array of markets', () => {
    rpc.createRPCAction = jest.fn();
    fetchBalance('exchange', ['BTC', 'USD']);
    expect(rpc.createRPCAction).toHaveBeenCalledTimes(1);
    expect(rpc.createRPCAction).toHaveBeenCalledWith('fetchBalance', getBalance, {
      exchange: 'exchange',
      markets: 'BTC,USD'
    });
  });
});
