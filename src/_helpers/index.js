import dictionary from './cryptocurrencies.json';
export function getCurrency(short) {
  return dictionary[short] ? dictionary[short] : short;
}

export const defaultLocale = 'en-us';

export const defaultMoneyFormatOptions = {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
  useGrouping: true
};

export const defaultCryptocurrencyFormatOptions = {
  style: 'decimal',
  minimumFractionDigits: 0,
  maximumFractionDigits: 8,
  useGrouping: false
};

/**
 * Formats a number in USD format ($0.00)
 * defaults to en-US locale
 * @export
 * @param {number} number - if not number type will not make a conversion
 * @params {string} locals - defaults to en-us
 * @params {Object} options - toLocaleString options
 * @returns {String} fromatted number
 */
export function formatMoney(number, locale = defaultLocale, options = {}) {
  if (isNaN(number) || number === null) {
    return number;
  }
  return number.toLocaleString(locale, { ...defaultMoneyFormatOptions, ...options });
}

/**
 * Formats a number in crypto format 0.00000000
 * defaults to en-US locale
 * @export
 * @param {number} number - if not number type will not make a conversion
 * @params {string} locals - defaults to en-us
 * @params {Object} options - toLocaleString options
 * @returns {String} fromatted number
 */
export function formatCryptocurrency(number, locale = defaultLocale, options = {}) {
  if (isNaN(number) || number === null) {
    return number;
  }
  const opts = { ...defaultCryptocurrencyFormatOptions, ...options };
  return number.toLocaleString(locale, opts);
}

/**
 * Format Decimal String
 */
export function formatDecimalString(precision, value) {
  value = value.replace(',', '.');
  if (value.includes('.')) {
    let integer = value.split('.')[0];
    let rest = value.split('.').slice(1);
    if (rest.length && precision > 0) {
      integer += `.${rest[0].slice(0, precision)}`;
    }
    return integer;
  }
  return value;
}

export function formatPercentage(
  number,
  locale = defaultLocale,
  options = { maximumFractionDigits: 2 }
) {
  if (isNaN(number) || number === null) {
    return number;
  }
  return number.toLocaleString(locale, { ...defaultCryptocurrencyFormatOptions, ...options });
}

/**
 * Safe way to obtain a number from string or empty values
 * If NaN function will return 0
 *
 * @export
 * @param {any} number - can be anything
 * @returns {Number} actual number
 */
export function safeNumericValue(number) {
  if (!number || isNaN(number)) {
    return 0;
  }
  if (typeof number === 'string') {
    return Number(number);
  }
  return number;
}

/**
 * Simple format number into USD currency string
 *
 * @export
 * @param {Number} number
 * @returns {String} formatted currency or blank string
 */
export function toUsd(number, precision = 2) {
  return number === undefined ? '' : `$${number.toFixed(precision)}`;
}

export function getCoinInSymbol(symbol) {
  if (typeof symbol !== 'string') {
    return symbol;
  }
  return symbol.split('/')[0];
}

/**
 * Returns trading pair as {base, quote} (BaseCurrency/QuoteCurrency) terminology
 * See: https://github.com/ccxt/ccxt/wiki/Manual#market-structure
 * @param {Object} market Market Object
 * @returns {object} Trading pair
 */
export function getTradingPair(market) {
  const symbol = market && typeof market === 'object' ? market.symbol || '' : market || '';
  const [base, quote] = symbol.split(symbol.indexOf('/') === -1 ? '-' : '/');
  return {
    base,
    quote
  };
}

/**
 * Returns Symbol required for TradingView widget
 * See: https://github.com/tradingview/charting_library/wiki/Symbology
 * @param {String} exchange
 * @param {String} symbol
 */
export function getTradingSymbol(exchange, symbol) {
  return `${exchange}:${symbol}`;
}

/**
 * Returns true if the value is '', undefined or null
 * @param {Any} value
 */
export function isEmptyValue(value) {
  return !value && value !== 0 && value !== '0';
}

/**
 * Formats a symbol with dashes BTC-ETH
 * @param {string} symbol BTC/USD
 * @return {string} BTC-ETH
 */
export function getSymbolForUrl(symbol) {
  return symbol.replace('/', '-');
}

export function capitalize(str) {
  if (typeof str !== 'string') {
    return str;
  }
  return str.substr(0, 1).toUpperCase() + str.substr(1);
}

/**
 * Truncates a decimal to a certain place, excepts strings and numbers
 * @param {string|number} number 0.0234345 or '0.0248234'
 * @return {string} truncated number as a string
 */
export function truncateNumber(number, to = null) {
  if (to === null) {
    to = defaultCryptocurrencyFormatOptions.maximumFractionDigits;
  }
  if (number.toFixed) {
    return String(number.toFixed(to));
  }
  return String(Number(number).toFixed(to));
}

/**
 * Checks if a USD string e.g. '$0.04' is less than the crumb ammount given
 * @param {string} the USD amount
 * @param {number} the crumb amount, e.g. 1 for $1 or 0.5 for $0.5
 * @return {boolean} returns true if the amount is a crumb
 */
export function amountIsCrumb(amount, threshold = 1) {
  if (!amount) return true;
  const currencySymbol = amount[0];
  switch (currencySymbol) {
    case '$':
      return parseFloat(amount.slice(1)) < threshold;
    default:
      return true;
  }
}
