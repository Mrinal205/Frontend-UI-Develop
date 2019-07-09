const number = x => (x === null ? NaN : +x);

/**
 * Calculates the variance of data in an array
 * @param {array} values An array of values
 * @param {func} valueof Accessor function to get values from data array.
 * @returns Variance value for an array
 */
export const variance = (values, valueof) => {
  const n = values.length;
  let m = 0,
    i = -1,
    mean = 0,
    value,
    delta,
    sum = 0;

  if (valueof == null) {
    while (++i < n) {
      if (!isNaN((value = number(values[i])))) {
        delta = value - mean;
        mean += delta / ++m;
        sum += delta * (value - mean);
      }
    }
  } else {
    while (++i < n) {
      if (!isNaN((value = number(valueof(values[i], i, values))))) {
        delta = value - mean;
        mean += delta / ++m;
        sum += delta * (value - mean);
      }
    }
  }

  if (m > 1) return sum / (m - 1);
};

/**
 * Calculates standard deviation for an array of data
 * @param {array} array Array which contains data
 * @param {func} f Accessor function to get data from data array
 * @returns A numeric standard deviation value
 */
export const deviation = (array, f) => {
  const v = variance(array, f);
  return v ? Math.sqrt(v) : v;
};

/**
 * Takes raw orderbook data and formats and proccesses it for Depth Chart.
 * @param {array} data Raw Orderbook Data.
 * @param {'ask' | 'bid'} direction Data type.
 * @returns Array of accumulating y coords of depth for react vis.
 */
export const formatData = (data, direction, marketPrice, precision) => {
  if (!data.length) return [];
  let totalQuantity = 0;
  // add up all the bids to give downward slope
  if (direction === 'bids') {
    data.forEach(set => {
      if (set[0] <= marketPrice) totalQuantity += set[1];
    });
  }
  const sortedData = data.sort((setA, setB) => setA[0] - setB[0]);
  const accumulator = {};
  const result = [];
  // if asks then start at 0 for smooth graph & hover effects
  if (direction === 'asks') result.push({ x: marketPrice, y: 0 });
  sortedData.forEach(set => {
    const price = parseFloat(Number(set[0]).toFixed(precision));
    const quantity = Number(set[1]);
    if (direction === 'bids' && price <= marketPrice) {
      accumulator[price] = totalQuantity;
      totalQuantity -= quantity;
    } else if (direction === 'asks' && price >= marketPrice) {
      totalQuantity += quantity;
      accumulator[price] = totalQuantity;
    }
  });

  Object.keys(accumulator).forEach(price => {
    result.push({ x: parseFloat(price), y: Number(accumulator[price].toFixed(precision)) });
  });
  // if bids then end at 0 for smooth graph & hover effects
  if (direction === 'bids') result.push({ x: marketPrice, y: 0 });
  return result.sort((a, b) => a.x - b.x);
};

/***
 * Generates array of x coordinates based on price, tick count, and tick size.
 * @param {number} price Current market price.
 * @param {number} ticksPerSide Count of ticks wanted on each side.
 * @param {number} tickSize The width between tick marks.
 * @returns Array of x coordinates for tick marks.
 */
export const getVerticalTicks = (price, ticksPerSide, tickSize) => {
  if (!price || !ticksPerSide || !tickSize) return [];
  const ticksArr = [];
  const adjTicksPerSide = ticksPerSide;
  for (let x = -1 * adjTicksPerSide; x <= adjTicksPerSide; x++) {
    let tickValue;
    if (x === 0) {
      tickValue = price;
    } else {
      tickValue = price + x * tickSize;
    }
    ticksArr.push(tickValue);
  }
  return ticksArr;
};

/**
 * Filters out data points outside of ticks arr.
 * @param {Number} windowStart Lowest X coordinate.
 * @param {Number} windowEnd Highest X coordinate.
 * @param {Array} dataArr Array of bids or asks to filter.
 * @param {"bids" | "asks"} direction Array of bids or asks to filter.
 * @returns Filtered Array containing only points within tick marks.
 */
export const removeOutside = (windowStart, windowEnd, dataArr, direction) => {
  let removed = {};
  let foundSmallerThanWindowStart = false;
  let foundGreaterThanWindowEnd = false;
  let maxValueFound = 0;
  const result = dataArr.filter(pair => {
    if (pair[0] < windowStart || pair[0] > windowEnd) {
      if (pair[0] < windowStart) {
        foundSmallerThanWindowStart = true;
        removed[windowStart] = pair[1];
      } else {
        foundGreaterThanWindowEnd = true;
        removed[windowEnd] = removed[windowEnd] ? removed[windowEnd] : pair[1];
      }
    }
    const shouldKeep = pair[0] >= windowStart && pair[0] <= windowEnd;
    if (shouldKeep) {
      maxValueFound = Math.max(pair[1], maxValueFound);
    }
    return shouldKeep;
  });
  if (!foundGreaterThanWindowEnd && direction === 'asks') {
    result.push([windowEnd, maxValueFound]);
  }
  if (!foundSmallerThanWindowStart && direction === 'bids') {
    result.push([windowStart, maxValueFound]);
  }
  Object.keys(removed).forEach(key => result.push([key, removed[key]]));
  return result;
};

/**
 * Generates formatting for y axis numbers
 * @param {number} num Y axis tick Number to be formatted.
 * @returns A string containing what to display for the y axis.
 */
export const horizontalTickFormat = num => {
  if (num <= 0) return '';
  if (num < 1000) return num;
  if (num < 1000000) {
    const fixed = (num / 1000).toFixed(1);
    const result = fixed.slice(-2) === '.0' ? num / 1000 : fixed;
    return result + 'K';
  }
  if (num < 1000000000) {
    const fixed = (num / 1000000).toFixed(1);
    const result = fixed.slice(-2) === '.0' ? num / 1000000 : fixed;
    return result + 'M';
  }
  if (num < 1000000000000) {
    const fixed = (num / 1000000000).toFixed(1);
    const result = fixed.slice(-2) === '.0' ? num / 1000000000 : fixed;
    return result + 'G';
  }
};

/**
 * Checks if any negative tick values exist
 * @param {array} ticksArr Array of tick values
 * @returns Boolean value representing if a negative value was found in the ticksArr.
 */
const checkIfNegativeTicks = ticksArr => {
  for (let x = 0; x < ticksArr.length; x++) {
    if (ticksArr[x] < 0) return true;
  }
  return false;
};

/***
 * Gets X axis tick mark values from a standard deviation.
 * @param {number} vertTickCount Amount of tick marks per side.
 * @param {number} stdDev The standard deviation of the data we are calculating ticks for.
 * @param {number} stdDevMultiplier Adjustable value to keep window in positive integer ranger.
 * @param {number} price The current market price
 * @param {number} zoom Current zoom value
 * @returns An array of X axis tick values.
 */
export const getStdDevTicks = (vertTickCount, stdDev, stdDevMultiplier, price, zoom) => {
  if (!vertTickCount || !stdDev || stdDev <= 0.0000001 || stdDevMultiplier <= 0.2) return [];
  const vertTickSpacing = ((stdDev / zoom) * stdDevMultiplier) / vertTickCount;
  const vertTickValuesArr = getVerticalTicks(price, vertTickCount, vertTickSpacing);
  const shouldRecalculate = checkIfNegativeTicks(vertTickValuesArr);
  if (shouldRecalculate) {
    return getStdDevTicks(vertTickCount, stdDev * 0.9, stdDevMultiplier * 0.9, price, zoom);
  }
  return vertTickValuesArr;
};
