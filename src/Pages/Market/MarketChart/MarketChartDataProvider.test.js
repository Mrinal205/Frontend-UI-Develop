import MarketChartDataProvider from './MarketChartDataProvider';

describe('MarketChartDataProvider', () => {
  it('instantiates without error', () => {
    const dataProvider = new MarketChartDataProvider({
      onDataReset: jest.fn()
    });
    expect(dataProvider).toBeDefined();
  });
});
