import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import { storiesOf } from '@storybook/react';

import { ExchangeSwitcher } from './ExchangeSwitcher';

const exchanges = [
  { name: 'Binance', exchangeName: 'BINANCE' },
  { name: 'Bittrex', exchangeName: 'BITTREX' },
  { name: 'GDAX', exchangeName: 'GDAX' },
  { name: 'Kraken', exchangeName: 'KRAKEN' },
  { name: 'Kucoin', exchangeName: 'KUCOIN' },
  { name: 'Poloniex', exchangeName: 'POLONIEX' }
];

storiesOf('ExchangeSwitcher', module)
  .add('default (yellow activity)', () => {
    const selectedExchange = {
      name: 'GDAX',
      exchangeName: 'GDAX',
      lastActivity: {
        marketTicker: new Date().getTime() - 10 * 1000
      }
    };

    return (
      <div style={{ width: '18rem' }}>
        <Router>
          <ExchangeSwitcher
            exchanges={exchanges}
            selectedExchange={selectedExchange}
            showIndicator
          />
        </Router>
      </div>
    );
  })
  .add('with green activity', () => {
    const selectedExchange = {
      name: 'GDAX',
      exchangeName: 'GDAX',
      lastActivity: {
        marketTicker: new Date().getTime() - 10 * 1000,
        orderBook: new Date().getTime() - 2 * 1000,
        trades: new Date().getTime() - 30 * 1000
      }
    };

    return (
      <div style={{ width: '18rem' }}>
        <Router>
          <ExchangeSwitcher
            exchanges={exchanges}
            selectedExchange={selectedExchange}
            showIndicator
          />
        </Router>
      </div>
    );
  })
  .add('with red activity', () => {
    const selectedExchange = {
      name: 'GDAX',
      exchangeName: 'GDAX',
      lastActivity: {
        marketTicker: new Date().getTime() - 120 * 1000,
        orderBook: new Date().getTime() - 240 * 1000,
        trades: new Date().getTime() - 300 * 1000
      }
    };

    return (
      <div style={{ width: '18rem' }}>
        <Router>
          <ExchangeSwitcher
            exchanges={exchanges}
            selectedExchange={selectedExchange}
            showIndicator
          />
        </Router>
      </div>
    );
  });
