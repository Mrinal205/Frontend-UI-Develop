import { AllExchangesData } from '_constants';

export function getMarketUrl(exchange, symbol) {
  return `/market/${exchange}/${symbol.replace('/', '-')}`;
}

export function getWalletUrl(exchange) {
  if (exchange === AllExchangesData.exchangeName) {
    return '/wallet';
  }
  return `/wallet/${exchange}`;
}

export function openExternalLink(event) {
  event.preventDefault();
  window.open(event.currentTarget['href']);
}
