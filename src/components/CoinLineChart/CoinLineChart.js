import React from 'react';
import { connect } from 'react-redux';
import { get } from 'lodash/object';
import {
  XYPlot,
  LineSeries,
  XAxis,
  MarkSeries,
  HorizontalGridLines,
  VerticalGridLines,
  Hint
} from 'react-vis';
import moment from 'moment';
import 'moment-timezone';

import { fetchCandlesticks } from '_actions/candlesticks.actions';

import GridBox from 'components/GridBox/GridBox';

import './CoinLineChart.scss';

const chartStyles = {
  crosshair: {
    stroke: '#08b689'
  },
  mark: {
    fill: '#fff',
    strokeWidth: 4,
    stroke: '#08b689'
  },
  axis: {
    line: { display: 'none' },
    text: { fontWeight: 'bold', fill: '#355b82' }
  }
};

export class CoinLineChart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      timezone: moment.tz.guess()
    };
    this.resizeChart = this.resizeChart.bind(this);
  }

  componentWillMount() {
    this.loadCandlesticksData();
  }

  componentDidMount() {
    this.resizeChart();
    window.addEventListener('resize', this.resizeChart);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeChart);
  }

  componentDidUpdate(prevProps) {
    if (this.props.candlesticks !== prevProps.candlesticks) {
      this.resizeChart();
    }
  }

  componentWillReceiveProps(nextProps) {
    const { exchangeName, symbol, resolution } = nextProps;
    if (
      exchangeName !== this.props.exchangeName ||
      symbol !== this.props.symbol ||
      resolution !== this.props.resolution
    ) {
      this.loadCandlesticksData(nextProps);
    }
  }

  loadCandlesticksData(props) {
    const { exchangeName, symbol, resolution, fetchCandlesticks, lookback } = props || this.props;

    const since = lookback ? new Date().getTime() - lookback : null;
    fetchCandlesticks(exchangeName, symbol, resolution, since);
  }

  resizeChart() {
    if (this.refs && this.refs.frame) {
      const width = this.refs.frame.offsetWidth;
      this.setState({ width });
    }
  }

  selectMark(selectedMark = null) {
    this.setState({ selectedMark });
  }

  prepareChartData(candlesticks) {
    const data = [];
    candlesticks.forEach((item, i) => {
      if (i % 4 === 0) {
        data.push({
          x: item[0],
          y: item[4]
        });
      }
    });
    return data;
  }

  renderLoading() {
    return (
      <GridBox
        transparent={true}
        loading={true}
        loadingStyle="horizontal"
        loadingMessage="Fetching chart..."
      />
    );
  }

  render() {
    const { candlesticks } = this.props;
    const { height, width, timezone, selectedMark } = this.state;
    const data = this.prepareChartData(candlesticks);
    if (!data.length) {
      return this.renderLoading();
    } else {
      return (
        <div className="CoinLineChart" ref="frame">
          <XYPlot
            height={height || 141}
            width={width || 0}
            margin={{ top: 5, left: 0, right: 0, bottom: 30 }}
            onMouseLeave={this.selectMark.bind(this, null)}
          >
            <LineSeries
              data={data}
              color="#007FC6"
              strokeWidth={3}
              curve={'curveMonotoneX'}
              onNearestX={this.selectMark.bind(this)}
            />
            <XAxis
              tickFormat={v => {
                return moment(v)
                  .tz(timezone)
                  .format('HH:SS');
              }}
              style={chartStyles.axis}
              tickTotal={8}
              tickLabelAngle={0}
            />
            {selectedMark && [
              <HorizontalGridLines
                key="h-line"
                style={chartStyles.crosshair}
                tickValues={[selectedMark.y]}
              />,
              <VerticalGridLines
                key="v-line"
                style={chartStyles.crosshair}
                tickValues={[selectedMark.x]}
              />,
              <MarkSeries key="dot" data={[selectedMark]} style={chartStyles.mark} />,
              <Hint key="hint" className="rv-hint" value={selectedMark}>
                <div className="rv-hint-content">{selectedMark.y}</div>
              </Hint>
            ]}
          </XYPlot>
        </div>
      );
    }
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    ...ownProps,
    candlesticks: get(state.candlesticks.list, `${ownProps.symbol}.${ownProps.exchangeName}`, [])
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchCandlesticks: (...params) => {
      dispatch(fetchCandlesticks(...params));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CoinLineChart);
