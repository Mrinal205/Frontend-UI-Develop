import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import './ChartSwitch.scss';

export const ChartSwitch = ({ showChartId, ChartTypes, changeChartType }) => {
  if (!ChartTypes || typeof ChartTypes !== 'object') return <div />;
  const chartsArr = Object.keys(ChartTypes);
  return (
    <div className="ChartSwitch">
      {chartsArr.map(chartKey => {
        const currentChart = ChartTypes[chartKey];
        const isActive = showChartId === currentChart.id;
        const selectorClassName = classnames({
          'ChartSwitch--button': true,
          'ChartSwitch--button--active': isActive
        });
        return (
          <div
            key={currentChart.id}
            className={selectorClassName}
            onClick={() => changeChartType(currentChart.id)}
          >
            {currentChart.title}
          </div>
        );
      })}
    </div>
  );
};

ChartSwitch.defaultProps = {
  showChartId: 'Loading',
  chartTypes: {
    Loading: {
      id: 'Loading',
      title: 'Loading'
    }
  },
  changeChartType: () => {}
};

ChartSwitch.propTypes = {
  showChartId: PropTypes.string,
  ChartTypes: PropTypes.object,
  changeChartType: PropTypes.func
};

export default ChartSwitch;
