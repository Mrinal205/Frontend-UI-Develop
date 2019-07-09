import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { amountIsCrumb } from '_helpers';
import { CHART_COLORS } from '_constants';
import Spinner from 'components/Spinner';

const makePercent = (num, total) => Math.round((num / total) * 100);
const stripBTCSymbol = str => (str ? str.split(' BTC')[0] : '');

const getChartData = balance => {
  // Get all of the coins and their usd values
  let others = 0;
  let { labels, totals } = balance
    .filter(b => !!b.usdValue && !!b.coin)
    .filter(b => {
      const ret = !amountIsCrumb(b.usdValue);
      if (!ret) {
        others += Number(stripBTCSymbol(b.btcValue));
      }
      return ret;
    })
    .reduce(
      (acc, i) => {
        if (!acc.labels.includes(i.coin)) {
          return {
            labels: [...acc.labels, i.coin],
            totals: [...acc.totals, Number(stripBTCSymbol(i.btcValue))]
          };
        }
        const index = acc.labels.indexOf(i.coin);
        acc.totals[index] += Number(stripBTCSymbol(i.btcValue));
        return acc;
      },
      { labels: [], totals: [] }
    );

  // Cap the list of labels off at 10
  labels = labels.reduce((acc, i) => (acc.length < 9 ? [...acc, i] : [...acc.slice(0, 8)]), []);
  if (others > 0) {
    labels.push('Others');
  }
  // Cap the list of totals off at 10
  totals = totals.reduce(
    (acc, i) => (acc.length < 10 ? [...acc, i] : [...acc.slice(0, 9), acc[9] + i]),
    []
  );
  if (others > 0) {
    totals.push(others);
  }

  return {
    labels: labels,
    datasets: [
      {
        label: 'Wallet Holdings',
        data: totals,
        backgroundColor: CHART_COLORS,
        borderWidth: 0
      }
    ]
  };
};

const getChartOptions = () => ({
  maintainAspectRatio: false,
  cutoutPercentage: 75,
  legend: {
    position: 'right',
    labels: {
      boxWidth: 15,
      fontColor: '#fff',
      padding: 20,
      generateLabels: c => {
        const total = c.config.data.datasets[0].data.reduce((s, n) => s + n, 0);
        return c.config.data.labels.map((l, i) => {
          const num = c.config.data.datasets[0].data[i];
          const percent = makePercent(num, total);
          const text = `${l} - ${percent}%`;
          const fillStyle = c.config.data.datasets[0].backgroundColor[i];
          return {
            text,
            fillStyle
          };
        });
      }
    }
  },
  tooltips: {
    callbacks: {
      label: (tooltipItem, data) => {
        const symbol = data.labels[tooltipItem.index];
        const num = data.datasets[0].data[tooltipItem.index];
        const total = data.datasets[0].data.reduce((s, n) => s + n, 0);
        const percent = makePercent(num, total);
        return `${symbol} - ${percent}%`;
      }
    }
  }
});

const Loading = () => (
  <div className="Chart__Loader">
    <span className="Chart__Loader-text">Loading chart data</span>
    <Spinner color="blue" />
  </div>
);

const NoHoldings = () => (
  <div className="Chart__Loader">
    <span className="Chart__Loader-text">No holdings to display</span>
  </div>
);

const DashboardHoldingsChart = props => {
  if (props.loading) return <Loading />;
  if (!props.balance.length) return <NoHoldings />;

  const data = getChartData(props.balance);
  const options = getChartOptions();

  return <Doughnut data={data} options={options} />;
};

export default DashboardHoldingsChart;
