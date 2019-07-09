/**
 * Returns base list of resolutions available for the chart datafeed
 */
export function getResolutions() {
  return ['1', '5', '15', '30', '60', '240', '1D', '5D', '7D'];
}

/**
 * Get available intraday resolutions per exchange (not every exchange support the same set)
 * @param {String} symbol
 */
export function getResolutionsConfig(symbol) {
  const defaults = {
    supported_resolutions: getResolutions(),
    has_intraday: true,
    intraday_multipliers: ['1', '5', '15', '60'],
    has_daily: true,
    has_weekly_and_monthly: false,
    has_empty_bars: true
  };

  const exchange = symbol.split(':')[0];
  if (exchange === 'BITTREX') {
    // TODO, keep better config
    defaults.intraday_multipliers = ['1', '5', '30', '60'];
  }

  return defaults;
}

/**
 * Get price formatting information for symbol
 * to provide better accuracy in plotting on chart
 * @param {*} symbol
 */
export function getCurrencyConfig(symbol) {
  const currency = symbol.split('/')[1];

  let minmov = 1;
  let pricescale = 100;
  let minmove2 = 0;

  if (currency === 'BTC' || currency === 'ETH') {
    pricescale = 1000000;
  }

  if (currency === 'BNB') {
    pricescale = 1000;
  }

  return {
    minmov,
    pricescale,
    minmove2
  };
}
