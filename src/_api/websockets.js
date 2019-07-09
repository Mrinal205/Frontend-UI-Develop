import Sockette from 'sockette';
import { TICKER_API_HOST } from '../_constants';

let ws;
let connecting = false;
let connectionEstablished = false;

export function establishStream(exchangeName, market, options) {
  // if connection is already established, just send subscribe message
  if (connectionEstablished) {
    subscribe(exchangeName, market);
    options.onSubscribe();
    return;
  }

  // prevent duplicated connections
  if (connecting) {
    return false;
  }

  // otherwise, establish connection and subscribe in 'connected' callback
  connecting = true;

  const connectionOptions = {
    timeout: 5e3,
    maxAttempts: 10,
    onopen: e => {
      connecting = false;
    },
    onmessage: e => {
      if (e.data === 'connected') {
        connectionEstablished = true;
        options.onSubscribe();
        subscribe(exchangeName, market);
        return;
      }

      if (e.data.indexOf('exchange') !== -1) {
        try {
          const ticker = JSON.parse(e.data);
          options.onMessage(ticker);
        } catch (err) {
          options.onMessageError(err);
        }
      }
    },
    onreconnect: e => {
      console.log('Reconnecting to websocket feed!');
    },
    onmaximum: e => {
      console.error(
        'Maximum number of attempts reached! Failed to establish Websocket connection!'
      );
      connectionEstablished = false;
    },
    onclose: e => {
      console.log('Websocket connection closed!');
      connectionEstablished = false;
    },
    onerror: e => {
      if (options.onError) {
        options.onError(e);
      }
    }
  };

  ws = new Sockette(`wss://${TICKER_API_HOST}`, connectionOptions);
  return ws;
}

/**
 *
 * @param {String} exchangeName - exchangeName to subscribe
 * @param {String} market - market symbol to srubscribe
 */
export function subscribe(exchangeName, market) {
  const message = {
    exchange: exchangeName.toLowerCase(),
    symbol: market
  };
  ws.send(JSON.stringify(message));
}

export function closeConnection() {
  console.log('Closing websocket connection');
  ws.close();
}
