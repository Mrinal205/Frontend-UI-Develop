import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classnames from 'classnames';

// import { deviation as d3deviation } from "d3-array";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';

import {
  XYPlot,
  LineSeries,
  AreaSeries,
  XAxis,
  YAxis,
  MarkSeries,
  VerticalGridLines,
  Hint
} from 'react-vis';

import GridBox from 'components/GridBox/GridBox';
import { Container } from 'components/GridSystem/GridSystem';

import {
  selectOrderbookPage,
  selectOrderbookPrice,
  selectOrderbookPrecision
} from '_actions/orderbook.actions';

import { orderbookByPrecisionSelector } from '_selectors/orderbook';
import { formatCurrency } from '_helpers/formatting';

import './DepthChart.scss';

import {
  deviation,
  formatData,
  removeOutside,
  horizontalTickFormat,
  getStdDevTicks
} from '_helpers/depthChart';

const ZoomSettings = {
  initial: 1,
  max: 10,
  min: 1,
  increments: 2
};

const defaultState = {
  selectedMark: null,
  width: 0,
  height: 0,
  zoom: ZoomSettings.initial,
  lowestX: 0,
  highestX: 0,
  highestY: 0,
  vertTickValuesArrClean: [],
  formatBids: [],
  formatAsks: []
};
export class DepthChart extends Component {
  constructor(props) {
    super(props);
    this.state = defaultState;
    this.intervalHolder = null;
    this.chartAreaRef = React.createRef();
    this.resizeChart = this.resizeChart.bind(this);
    this.increaseZoom = this.increaseZoom.bind(this);
    this.decreaseZoom = this.decreaseZoom.bind(this);
  }

  increaseZoom() {
    const { zoom } = this.state;
    if (zoom < ZoomSettings.max) {
      this.setState({ zoom: zoom + ZoomSettings.increments });
      this.updateData();
    }
  }
  decreaseZoom() {
    const { zoom } = this.state;
    if (zoom > ZoomSettings.min) {
      this.setState({ zoom: zoom - ZoomSettings.increments });
      this.updateData();
    }
  }

  beginInterval() {
    const intervalHolder = setInterval(this.updateData.bind(this), 3000);
    this.intervalHolder = intervalHolder;
  }

  endInterval() {
    clearInterval(this.intervalHolder);
  }

  componentDidMount() {
    this.beginInterval();
    this.resizeChart();
    window.addEventListener('resize', this.resizeChart);
  }

  componentWillUnmount() {
    this.endInterval();
    window.removeEventListener('resize', this.resizeChart);
  }

  resizeChart() {
    const { offsetWidth: width, offsetHeight: height } = this.refs.frame;
    this.setState({ width, height });
  }

  selectMark(selectedMark = null, index) {
    if (!selectedMark) return this.setState({ selectedMark: null });
    if (selectedMark && selectedMark.y === 0) return null;
    return this.setState({ selectedMark });
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.symbol !== prevProps.symbol ||
      this.props.orderbook.precision !== prevProps.orderbook.precision
    ) {
      this.setState(defaultState);
      this.resizeChart();
    }
  }

  updateData() {
    const { bids, asks, precision } = this.props.orderbook;
    const { price } = this.props.market;
    const vertTickCount = 4;
    const combined = Array.prototype.concat(bids, asks);
    const stdDev = deviation(combined, d => d[0]);
    const vertTickValuesArr = getStdDevTicks(vertTickCount, stdDev, 2, price, this.state.zoom);
    const vertTickValuesArrClean = Array.from(vertTickValuesArr).slice();
    const lowestX = vertTickValuesArrClean.shift();
    const highestX = vertTickValuesArrClean.pop();
    const normalizedBids = removeOutside(lowestX, highestX, bids, 'bids', precision);
    const normalizedAsks = removeOutside(lowestX, highestX, asks, 'asks', precision);
    const formatBids = formatData(normalizedBids, 'bids', price, precision);
    const formatAsks = formatData(normalizedAsks, 'asks', price, precision);
    const leftDistance = (formatBids[0] && formatBids[0].y) || 0;
    const rightDistance =
      (formatAsks[formatAsks.length - 1] && formatAsks[formatAsks.length - 1].y) || 0;
    const highestY = leftDistance > rightDistance ? leftDistance : rightDistance;

    this.setState({ lowestX, highestX, vertTickValuesArrClean, formatBids, formatAsks, highestY });
  }

  renderLoading() {
    return (
      <div className="DepthLineChart-Loading">
        <Container>
          <GridBox
            loading
            transparent
            loadingMessage={`Building ${this.props.market.symbol} Chart`}
          />
        </Container>
      </div>
    );
  }

  renderZoom() {
    const { zoom } = this.state;
    const { precision } = this.props.orderbook;
    const { price, quote } = this.props.market;

    const titlePrice = formatCurrency(price, {
      precision,
      symbol: quote
    });

    return (
      <div className="DepthLineChart-Zoom">
        <div
          className={classnames('depth-side-button', {
            'depth-side-button-disabled': zoom >= ZoomSettings.max,
            'depth-side-button-enabled': zoom < ZoomSettings.max
          })}
          onClick={this.increaseZoom}
        >
          <FontAwesomeIcon icon={faPlus} />
        </div>
        <div className="depth-center-text">
          <div className="depth-center-text-price">{titlePrice}</div>
          <div className="depth-center-text-description">Mid Market Price</div>
        </div>
        <div
          className={classnames('depth-side-button', {
            'depth-side-button-disabled': zoom <= ZoomSettings.min,
            'depth-side-button-enabled': zoom > ZoomSettings.min
          })}
          onClick={this.decreaseZoom}
        >
          <FontAwesomeIcon icon={faMinus} />
        </div>
      </div>
    );
  }

  render() {
    const {
      width,
      selectedMark,
      lowestX,
      highestX,
      vertTickValuesArrClean,
      formatBids,
      formatAsks,
      highestY
    } = this.state;

    const ChartSettings = {
      hroizTickCount: 7,
      lineStrokeWidth: 1,
      areaOpacity: 0.2,
      lineCurve: 'curveStep',
      bidsColor: '#08b689',
      asksColor: '#e05140'
    };

    return (
      <div className="DepthLineChart" ref="frame">
        <div className="DepthLineChart-Title">Depth Chart</div>
        {this.renderZoom()}
        {!vertTickValuesArrClean.length ? (
          this.renderLoading()
        ) : (
          <XYPlot
            xDomain={[lowestX, highestX]}
            yDomain={[0, highestY * 1.05]}
            height={400}
            width={width}
            margin={{ top: 40, left: 40, right: 40, bottom: 20 }}
            onMouseLeave={this.selectMark.bind(this, null)}
          >
            <VerticalGridLines tickValues={vertTickValuesArrClean} />
            <XAxis
              key="bottom-x-axis"
              tickValues={vertTickValuesArrClean}
              tickSize={0}
              orientation="bottom"
            />
            <XAxis
              key="top-x-axis"
              tickValues={vertTickValuesArrClean}
              tickSize={0}
              orientation="top"
              tickFormat={() => ''}
            />
            <YAxis
              key="left-y-axis"
              tickFormat={horizontalTickFormat}
              className="rv-xy-plot__axis__tick__text"
              tickSizeInner={0}
              tickTotal={ChartSettings.hroizTickCount}
              orientation="left"
            />
            <YAxis
              key="right-y-axis"
              tickFormat={horizontalTickFormat}
              className="rv-xy-plot__axis__tick__text"
              tickSizeInner={0}
              tickTotal={ChartSettings.hroizTickCount}
              orientation="right"
            />
            <LineSeries
              key="bids-line"
              curve={ChartSettings.lineCurve}
              data={formatBids}
              stroke={ChartSettings.bidsColor}
              strokeWidth={ChartSettings.lineStrokeWidth}
              onSeriesMouseOut={this.selectMark.bind(this, null)}
              onNearestX={this.selectMark.bind(this)}
            />
            <AreaSeries
              key="bids-area"
              curve={ChartSettings.lineCurve}
              data={formatBids}
              stroke={ChartSettings.bidsColor}
              opacity={ChartSettings.areaOpacity}
            />
            <LineSeries
              key="asks-line"
              curve={ChartSettings.lineCurve}
              data={formatAsks}
              stroke={ChartSettings.asksColor}
              strokeWidth={ChartSettings.lineStrokeWidth}
              onSeriesMouseOut={this.selectMark.bind(this, null)}
              onNearestX={this.selectMark.bind(this)}
            />
            <AreaSeries
              key="asks-area"
              curve={ChartSettings.lineCurve}
              fill={ChartSettings.asksColor}
              opacity={ChartSettings.areaOpacity}
              data={formatAsks}
            />
            {selectedMark && [
              <LineSeries
                key="highlight-line"
                data={[{ x: selectedMark.x, y: 0 }, { x: selectedMark.x, y: selectedMark.y }]}
                color="#08b689"
                strokeWidth={1}
                curve={'curveMonotoneX'}
                style={{
                  strokeDasharray: '6 6'
                }}
                onNearestX={this.selectMark.bind(this)}
              />,
              <MarkSeries
                key="highlight-dot"
                data={[selectedMark]}
                style={{
                  fill: '#fff',
                  strokeWidth: 4,
                  stroke: '#08b689'
                }}
              />,
              <Hint key="hint" className="rv-hint" value={selectedMark}>
                <div className="rv-hint-content">{selectedMark.y}</div>
              </Hint>
            ]}
          </XYPlot>
        )}
      </div>
    );
  }
}

const mapStateToProps = state => {
  const { bids, asks } = orderbookByPrecisionSelector(state);
  return {
    trades: state.trades.list,
    orderbook: state.orderbook,
    bids,
    asks
  };
};

const mapDispatchToProps = {
  selectOrderbookPage,
  selectOrderbookPrice,
  selectOrderbookPrecision
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DepthChart);
