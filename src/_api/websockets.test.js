import { establishStream, subscribe, closeConnection } from './websockets';

describe('websockets api', () => {
  it('is defined', () => {
    expect(establishStream).toBeDefined();
    expect(subscribe).toBeDefined();
    expect(closeConnection).toBeDefined();
  });

  xit('subscribes to WS stream', () => {
    const exchangeName = 'BINANCE';
    const market = 'BTC/USDT';
    const options = {
      onSubscribe: jest.fn()
    };

    const ws = establishStream(exchangeName, market, options);
    expect(ws).toBeTruthy();
  });
});
