import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {
  FlexibleXYPlot,
  LineSeries,
  AreaSeries,
  XAxis,
  YAxis,
  GradientDefs,
  MarkSeries,
  Hint,
  linearGradient,
  stop
} from 'react-vis';
import moment from 'moment';
import { Link } from 'react-router-dom';

import { formatUsd } from '_helpers/formatting';
import { GridBox } from 'components/GridBox/GridBox';

import './NetworthChart.scss';

const MINIMUM_DATAPOINTS = 4;
const TOOLTIP_DATE_FORMAT = 'MMMM DD, YYYY';
const X_AXIS_DATE_FORMAT = 'HH:00';

export default class NetworthChart extends Component {
  static propTypes = {
    networth: PropTypes.object
  };

  state = {
    selectedValue: false,
    selectedRange: 1
  };

  getSelectedNetworthData() {
    const { selectedRange } = this.state;
    const dataItems = this.props.networth.usd;

    // for ALL return full range
    if (selectedRange === Infinity) {
      return dataItems;
    }

    // find items matching range
    const firstDatapoint = moment()
      .subtract(selectedRange, 'days')
      .valueOf();
    return dataItems.filter(item => item.date > firstDatapoint);
  }

  /** Returns chart data points */
  getChartData() {
    const networthData = this.getSelectedNetworthData();

    return networthData.map(pos => ({
      x: pos.date,
      y: pos.value
    }));
  }

  /**
   * Calculate data domain from min/max values of the data,
   * so that the chart has a little more space above/below values
   */
  getChartDataDomain() {
    const networthData = this.getSelectedNetworthData();

    const domain = networthData.reduce(
      (acc, pos) => {
        if (pos.value < acc.min) {
          acc.min = pos.value;
        }

        if (pos.value > acc.max) {
          acc.max = pos.value;
        }

        return acc;
      },
      {
        min: networthData[0].value,
        max: networthData[0].value
      }
    );

    return [Math.floor(domain.min), Math.ceil(domain.max)];
  }

  setRange = value => {
    this.setState({ selectedRange: value });
  };

  renderError() {
    return (
      <div className="NetworthChart NetworthChart--error">
        <GridBox>
          <p className="NetworthChart__error">
            Not enough data to display the chart yet. Please check again later.
          </p>
          <p className="NetworthChart__error">
            {'No exchange connected yet?'}
            <Link
              to="/account/exchanges"
              className="Button Button--small NetworthChart__connect-button"
            >
              Click here
            </Link>
          </p>
        </GridBox>
      </div>
    );
  }

  renderLoading() {
    return (
      <div className="NetworthChart NetworthChart--loading">
        <GridBox loading loadingMessage="Fetching balance information" />
      </div>
    );
  }

  renderRangeSelector() {
    const { selectedRange } = this.state;
    const ranges = [
      { label: '1D', value: 1 },
      { label: '7D', value: 7 },
      { label: '14D', value: 14 },
      { label: '1M', value: 30 },
      { label: '3M', value: 90 },
      { label: 'All', value: Infinity }
    ];

    return (
      <div className="RangeSelector">
        <strong className="RangeSelector__label">Range:</strong>
        {ranges.map(range => {
          const itemClassName = classNames('RangeSelector__item', {
            'RangeSelector__item--selected': range.value === selectedRange
          });

          return (
            <span
              key={range.label}
              className={itemClassName}
              onClick={() => this.setRange(range.value)}
            >
              {range.label}
            </span>
          );
        })}
      </div>
    );
  }

  renderChart() {
    const { selectedValue } = this.state;
    const data = this.getChartData();
    const dataDomain = this.getChartDataDomain();

    const AXIS_LABEL_COLOR = '#3d6496';
    const GRID_STROKE_COLOR = '#1a304d';
    const CHART_LINE_COLOR = '#3988c6';

    const plotProps = {
      margin: {
        left: 40,
        right: 70,
        top: 40,
        bottom: 60
      },
      border: {
        stroke: GRID_STROKE_COLOR,
        strokeWidth: 1
      },
      yDomain: dataDomain,
      onMouseLeave: () => this.setState({ selectedValue: false })
    };

    const axisStyles = {
      line: {
        stroke: GRID_STROKE_COLOR,
        strokeWidth: 1
      },
      text: {
        fill: AXIS_LABEL_COLOR,
        size: '12px'
      }
    };

    const xAxisProps = {
      orientation: 'bottom',
      tickFormat: value => moment(value).format(X_AXIS_DATE_FORMAT),
      tickTotal: 10,
      tickSize: 3,
      style: axisStyles
    };

    const yAxisProps = {
      orientation: 'right',
      tickFormat: value => formatUsd(value),
      tickTotal: 6,
      tickSize: 3,
      width: 100,
      style: axisStyles
    };

    const areaSeriesProps = {
      data,
      color: 'url(#MoonGradient)',
      curve: 'curveMonotoneX'
    };

    const lineSeriesProps = {
      data,
      style: {
        stroke: CHART_LINE_COLOR,
        strokeWidth: 3
      },
      curve: 'curveMonotoneX',
      onNearestX: val => this.setState({ selectedValue: val })
    };

    const markProps = {
      data: [selectedValue],
      style: {
        fill: '#fff',
        strokeWidth: 4,
        stroke: '#08b689'
      }
    };

    return (
      <FlexibleXYPlot {...plotProps}>
        <GradientDefs>
          <linearGradient id="MoonGradient" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#2acbff" stopOpacity={0.1} />
            <stop offset="100%" stopColor="#1939a6" stopOpacity={0.5} />
          </linearGradient>
        </GradientDefs>

        <XAxis {...xAxisProps} />
        <YAxis {...yAxisProps} />

        {/* Actual data plot */}
        <AreaSeries {...areaSeriesProps} />
        <LineSeries {...lineSeriesProps} />
        {selectedValue && <MarkSeries {...markProps} />}
        {selectedValue && (
          <Hint value={selectedValue}>
            <div className="Networth__tooltip">
              <div className="Networth__tooltip-value">{formatUsd(selectedValue.y)}</div>
              <div className="Networth__tooltip-date">
                {moment(selectedValue.x).format(TOOLTIP_DATE_FORMAT)}
              </div>
            </div>
          </Hint>
        )}
      </FlexibleXYPlot>
    );
  }

  render() {
    const { networth } = this.props;

    if (networth.meta.loading) {
      return this.renderLoading();
    }

    // TODO: Adjust condition for minimum data points, when range selector is available
    if (networth.usd === undefined || this.getChartData().length < MINIMUM_DATAPOINTS) {
      return this.renderError();
    }

    return (
      <div className="NetworthChart">
        <GridBox title="Last 24h Balance">
          {/*
            <div className="NetworthChart__ranges">
              {this.renderRangeSelector()}
            </div>
          */}
          <div className="NetworthChart__area">{this.renderChart()}</div>
          <span className="NetworthChart__label">Wallet Balance</span>
        </GridBox>
      </div>
    );
  }
}
