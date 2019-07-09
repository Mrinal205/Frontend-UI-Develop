import createWidgetConfig from './config';

describe('Market Chart config', () => {
  it('has default config', () => {
    expect(createWidgetConfig().container_id).toEqual('MarketChartNode');
  });

  it('allows overrides', () => {
    expect(createWidgetConfig({ debug: false }).debug).toEqual(false);
  });
});
