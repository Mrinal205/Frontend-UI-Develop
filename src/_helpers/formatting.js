// TODO: In future, consider user locales
const defaultLocale = 'en-us';

const DEFAULT_MIN_PRECISION = 2;
const DEFAULT_MAX_PRECISION = 8;
const DEFAULT_CURRENCY_PRECISION = 8;
const DEFAULT_VOLUME_PRECISION = 0;
const DEFAULT_USD_PRECISION = 2;
const DEFAULT_PERCENTAGE_PRECISION = 2;

const defaultFormattingOptions = {
  style: 'decimal',
  minimumFractionDigits: DEFAULT_MIN_PRECISION,
  maximumFractionDigits: DEFAULT_MAX_PRECISION,
  useGrouping: true
};

/**
 *
 * Format number as EN-US locale
 * @param {Number} number value to be formatted
 * @param {Object} params options to override default formatting
 */
export function formatNumber(number, options = {}) {
  if (isNaN(number) || number === null) {
    return number;
  }

  return number.toLocaleString(defaultLocale, {
    ...defaultFormattingOptions,
    ...options
  });
}

/**
 * Format number as EN-US locale as price / currency
 * @param {Number} number value to be formatted
 * @param {Object} params options to override default formatting (default precision: 8)
 *
 * @TODO: Fix issue with rounding numbers... e.g. -- if you run the following:
 *        formatCurrency(14.7, { precision: 0 }) you will get 15 not 14
 */
export function formatCurrency(
  number,
  { precision = DEFAULT_CURRENCY_PRECISION, symbol, ...restOptions } = {}
) {
  if (isNaN(number) || number === null) {
    return number;
  }

  const formattedValue = formatNumber(number, {
    minimumFractionDigits: precision,
    maximumFractionDigits: precision,
    ...restOptions
  });

  if (symbol) {
    return `${formattedValue} ${symbol}`;
  }

  return formattedValue;
}

/**
 * Format number as EN-US locale as volume
 * @param {Number} number value to be formatted
 * @param {Object} params options to override default formatting (default precision: 2)
 */
export function formatVolume(
  number,
  { precision = DEFAULT_VOLUME_PRECISION, symbol, ...restOptions } = {}
) {
  if (isNaN(number) || number === null) {
    return number;
  }

  const formattedValue = formatNumber(number, {
    minimumFractionDigits: precision,
    maximumFractionDigits: precision,
    ...restOptions
  });

  if (symbol) {
    return `${formattedValue} ${symbol}`;
  }

  return formattedValue;
}

/**
 * Format number to EN-US locale as USD value
 * @param {Number} number value to be formatted
 * @param {Object} params options to override default formatting (default precision: 2)
 */
export function formatUsd(number, { precision = DEFAULT_USD_PRECISION, ...restOptions } = {}) {
  if (isNaN(number) || number === null) {
    return number;
  }

  const formattedValue = formatNumber(number, {
    minimumFractionDigits: precision,
    maximumFractionDigits: precision,
    ...restOptions
  });

  const result = `$${formattedValue}`;

  // for negative numbers we need to put minus symbol in front
  return number >= 0 ? result : result.replace('$-', '-$');
}

/**
 * Format number to EN-US locale as percentage value
 * @param {Number} number value to be formatted
 * @param {Object} params options to override default formatting
 */
export function formatPercentage(
  number,
  { precision = DEFAULT_PERCENTAGE_PRECISION, includeSymbol = true, ...restOptions } = {}
) {
  if (isNaN(number) || number === null) {
    return number;
  }

  const formattedValue = formatNumber(number, {
    minimumFractionDigits: precision,
    maximumFractionDigits: precision,
    ...restOptions
  });

  if (includeSymbol) {
    return `${formattedValue}%`;
  }

  return formattedValue;
}

/**
 * Scientific To Decimal
 */
export function scientificToDecimal(num) {
  const sign = Math.sign(num);
  if (/\d+\.?\d*e[+-]*\d+/i.test(num)) {
    const zero = '0';
    const parts = String(num)
      .toLowerCase()
      .split('e');
    const e = parts.pop();
    let l = Math.abs(e);
    const direction = e / l;
    const coeffArray = parts[0].split('.');

    if (direction === -1) {
      coeffArray[0] = Math.abs(coeffArray[0]);
      num = zero + '.' + new Array(l).join(zero) + coeffArray.join('');
    } else {
      const dec = coeffArray[1];
      if (dec) l = l - dec.length;
      num = coeffArray.join('') + new Array(l + 1).join(zero);
    }
  }
  return sign < 0 ? String(-num) : String(num);
}
