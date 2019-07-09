const COINBASE_EURO_COUNTRIES = [
  'Austria',
  'Belgium',
  'Bulgaria',
  'Croatia',
  'Cyprus',
  'Czech Republic',
  'Denmark',
  'Finland',
  'France',
  'Greece',
  'Hungary',
  'Ireland',
  'Italy',
  'Latvia',
  'Liechtenstein',
  'Malta',
  'Monaco',
  'Netherlands',
  'Norway',
  'Poland',
  'Portugal',
  'San Marino',
  'Slovakia',
  'Slovenia',
  'Spain',
  'Sweden',
  'Switzerland'
];

const COINBASE_SUPPORTED_COUNTRIES = [
  'United States',
  'United Kingdom',
  'Canada',
  'Australia',
  'Singapore',
  ...COINBASE_EURO_COUNTRIES
];

// Reference: Support Coinbase Pro
// https://support.pro.coinbase.com/customer/portal/articles/2945308-locations-and-trading-pairs
const COINBASE_MARKETS = {
  'United States': ['USD', 'USDC', 'BTC'],
  Europe: ['USDC', 'EUR', 'BTC'],
  'United Kingdom': ['USDC', 'GBP', 'EUR', 'BTC'],
  Canada: ['USDC', 'BTC'],
  Australia: ['USDC', 'BTC'],
  Singapore: ['USDC', 'BTC']
};

/**
 * Check if country belongs to EU region
 * @param {String} country
 */
function isEuropeRegion(country) {
  return COINBASE_EURO_COUNTRIES.includes(country);
}

/**
 * Check if country name is on a list of countries supported by Coinbase
 * @param {String} country
 */
function isCoinbaseAllowedCountry(country) {
  return COINBASE_SUPPORTED_COUNTRIES.includes(country);
}

/**
 * Check if market is allowed for particular country
 * @param {String} country
 * @param {String} marketSymbol
 */
export function isCoinbaseAllowedMarket(country, marketSymbol) {
  // if country is not on the list...
  if (isCoinbaseAllowedCountry(country) === false) {
    return false;
  }

  // otherwise check in the markets list (per region)
  const region = isEuropeRegion(country) ? 'Europe' : country;
  return COINBASE_MARKETS[region].includes(marketSymbol);
}
