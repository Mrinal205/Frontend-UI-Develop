import { FeesPerExchange } from '_constants';

const mapFieldToLimit = {
  size: 'amount',
  price: 'price',
  cost: 'cost'
};
const OrderNotSentError = 'Order not sent';

export const OrderValidations = {
  requiredNotZero: (values, field) => {
    if (!Number(values[field])) {
      if (values[field] === 0 || values[field] === '0') {
        return `${OrderNotSentError}: ${field} cannot be 0`;
      }
      return `${OrderNotSentError}: ${field} is required`;
    }

    return null;
  },
  requiredGreaterThan: (values, field, limits) => {
    const threshold = limits[mapFieldToLimit[field]].min;
    if (Number(values[field]) <= threshold) {
      return `${OrderNotSentError} : ${field} must be greater than ${threshold}`;
    }
    return null;
  },
  requiredLowerThan: (values, field, limits) => {
    const threshold =
      limits[mapFieldToLimit[field]].max !== undefined
        ? limits[mapFieldToLimit[field]].max === 0
          ? Infinity
          : limits[mapFieldToLimit[field]].max
        : Infinity;
    if (Number(values[field]) >= threshold) {
      return `${OrderNotSentError} : ${field} must be lower than ${threshold}`;
    }
    return null;
  }
};

export const getFeeForExchange = exchange => {
  const exchangeKey = exchange.exchangeName || exchange;
  return FeesPerExchange[exchangeKey] || 0.1;
};
