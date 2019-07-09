export const COINMARKETCAP_API_HOST = process.env.REACT_APP_COINMARKETCAP_API_HOST;
export const API_HOST = process.env.REACT_APP_BACKEND_API_HOST;
export const TICKER_API_HOST = process.env.REACT_APP_TICKER_API_HOST;
export const SENTRY_ENDPOINT = process.env.REACT_APP_SENTRY_ENDPOINT;

export const HOTJAR_ID = process.env.REACT_APP_HOTJAR_ID;
export const HOTJAR_VERSION = 6;

export const GOOGLE_ANALYTICS_ID = process.env.REACT_APP_GOOGLE_ANALYTICS_ID;

export const Order = {
  DESC: 'DESC',
  ASC: 'ASC'
};

export const OfferTypes = {
  BUY: 'buy',
  SELL: 'sell',
  CONVERT: 'convert'
};

export const DefaultDateFormat = 'YYYY-MM-DD';
export const DefaultTimeFormat = 'HH:mm:ss';

export const ONE_DAY_TIMESTAMP = 60 * 60 * 24 * 1000;

export const CandlesticksResolutions = {
  '1m': '1',
  '5m': '5',
  '15m': '15',
  '1h': '60',
  '1d': 'D'
};

export const MartketFields = {
  volume: 'volume_24h',
  change: 'change_24h',
  price: 'price'
};

export const DefaultMarketSorting = MartketFields.volume;

export const OrderTypes = {
  LIMIT: 'limit',
  MARKET: 'market',
  STOP: 'stop',
  SIGNAL: 'signal',
  CONVERT: 'convert'
};

export const OrderTypesTabs = [
  OrderTypes.LIMIT,
  OrderTypes.MARKET,
  OrderTypes.STOP,
  OrderTypes.SIGNAL,
  OrderTypes.CONVERT
];

export function getFormId(offerType, orderType) {
  return `marketForm-${offerType}-${orderType}`;
}

export const SignalBuyTypes = {
  PRICE_DROP: 'Price Drop',
  PRICE_DROP_PERCENTAGE: 'Price Drop %',
  PRICE_GROWTH: 'Price Growth',
  PRICE_GROWTH_PERCENTAGE: 'Price Growth %'
};

export const SignalBuyDurationTypes = [
  '1 Hour',
  '6 Hours',
  '12 Hours',
  '1 Day',
  '1 Week',
  '1 Month'
];

export const FeesPerExchange = {
  BINANCE: '~0.1% / 0.05%', //' (reduced fees in BNB)',
  BITTREX: '~0.25%',
  GDAX: '~0.1% / 0%' //' (takers/makers)',
  // POLONIEX: '~0.25% / ~0.15%', //' (takers/makers)',
  // KRAKEN: '~0.26% / 0.16%', //' (takers/makers)',
  // KUCOIN: '~0.1%'
};

export const NonNumericOrderFields = {
  coin: true,
  step: true,
  signalType: true,
  duration: true,
  orderType: true
};

export const NotificationTypes = {
  ORDER_PLACED: 'Order Placed',
  ORDER_FILLED: 'Order Filled',
  ORDER_CANCELED: 'Order Canceled'
};

export const OrderStatusTypes = {
  CANCELED: 'CANCELED',
  FILLED: 'FILLED',
  OPEN: 'OPEN'
};

export const OrderbookRowLimit = 14;

export const OrdersListLimit = 6;
// Negative number on order list means that it must render all the available items
export const OrdersListAll = -1;

export const TimeoutBeforeOrderPlaced = 3000;

export const IDLE_TIMEOUT = 1000 * 60 * 30; // 30 min
export const TICKER_THROTTLE_VALUE = 333;
export const CHART_THROTTLE_UPDATE_VALUE = 1000; // 1s

export const AllExchangesData = { label: 'All', exchangeName: 'ALL' };
export const AVAILABLE_EXCHANGES = [
  { label: 'Binance', exchangeName: 'BINANCE' },
  { label: 'Bittrex', exchangeName: 'BITTREX' },
  { label: 'Coinbase Pro', exchangeName: 'GDAX', extraPassphrase: true }
  // {label: 'Kraken', exchangeName: 'KRAKEN'}
  // {label: 'Kucoin', exchangeName: 'KUCOIN'}
  // {label: 'Poloniex', exchangeName: 'POLONIEX'}
];

// Doughnut Chart Colors
export const CHART_COLORS = [
  '#0043b6',
  '#08b689',
  '#007ad4',
  '#47b0e1',
  '#1e3555',
  '#1451a0',
  '#20a6fb',
  '#00b48a',
  '#87b5f3',
  '#0088fb'
];
