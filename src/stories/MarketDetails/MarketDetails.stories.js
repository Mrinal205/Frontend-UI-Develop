import React from 'react';
import { storiesOf } from '@storybook/react';

import GridBox from 'components/GridBox/GridBox';
import TableList from 'components/TableList/TableList';

storiesOf('MarketDetails Page', module)
  .add('Open Orders', () => {
    const columns = [
      { Header: 'Type', accessor: 'type' },
      { Header: 'Size', accessor: 'size' },
      { Header: 'Price', accessor: 'price' },
      { Header: 'Date / Time', accessor: 'datetime' },
      { Header: 'Filled', accessor: 'filled' },
      { Header: 'Status', accessor: 'status' }
    ];

    const data = [
      {
        type: 'Market Buy',
        size: '0.123 BTC',
        price: '849.32 USDT',
        datetime: '2017/03/13 12:36:03',
        filled: '0%',
        status: 'Open'
      },
      {
        type: 'Limit Buy',
        size: '2.12433 ETH',
        price: '689.34 GBP',
        datetime: '2017/03/13 12:36:03',
        filled: '3%',
        status: 'Open'
      },
      {
        type: 'Market Sell',
        size: '482 XRP',
        price: '239.83 USDT',
        datetime: '2017/03/13 12:36:03',
        filled: '53%',
        status: 'Open'
      },
      {
        type: 'Limit Sell',
        size: '3.50 LTC',
        price: '823.01 BTC',
        datetime: '2017/03/13 12:36:03',
        filled: '0%',
        status: 'Open'
      }
    ];

    return (
      <div>
        <GridBox title="Open orders">
          <TableList columns={columns} data={data} />
        </GridBox>
      </div>
    );
  })
  .add('No open orders', () => {
    const columns = [
      { Header: 'Type', accessor: 'type' },
      { Header: 'Size', accessor: 'size' },
      { Header: 'Price', accessor: 'price' },
      { Header: 'Date / Time', accessor: 'datetime' },
      { Header: 'Filled', accessor: 'filled' },
      { Header: 'Status', accessor: 'status' }
    ];

    const data = [];

    return (
      <div>
        <GridBox title="Open orders">
          <TableList
            columns={columns}
            data={data}
            noDataText="You don't have any open orders yet!"
          />
        </GridBox>
      </div>
    );
  });
