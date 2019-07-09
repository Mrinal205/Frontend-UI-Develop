import * as selector from './orderbook';

describe('Orderbook selectors', () => {
  const state = {
    orderbook: {
      precision: { quote: 8, base: 8, amount: 3, price: 8 },
      bids: [[0.084269, 1], [0.08426, 1]],
      asks: [[0.087269, 1], [0.0863, 1]]
    }
  };

  it('getOrderbook should return orderbook state', () => {
    expect(selector.getOrderbook(state)).toEqual(state.orderbook);
  });

  it('orderbookByPrecisionSelector should return formatted orderbook', () => {
    const expected = {
      asks: [
        { amount: '1.000', price: '0.08726900', total: '0.08726900', volume: 100 },
        { amount: '1.000', price: '0.08630000', total: '0.08630000', volume: 100 }
      ],
      bids: [
        { amount: '1.000', price: '0.08426900', total: '0.08426900', volume: 100 },
        { amount: '1.000', price: '0.08426000', total: '0.08426000', volume: 100 }
      ],
      orderbook: state.orderbook
    };
    expect(selector.orderbookByPrecisionSelector(state)).toEqual(expected);
  });
});
