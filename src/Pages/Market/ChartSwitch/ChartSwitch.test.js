import React from 'react';
import { shallow } from 'enzyme';
import ChartSwitch from './ChartSwitch';

describe('ChartSwitch Tests', () => {
  const ChartTypes = {
    MarketChart: {
      id: 'MarketChart',
      title: 'Price'
    },
    DepthChart: {
      id: 'DepthChart',
      title: 'Depth'
    }
  };

  it('should render all supplied ChartTypes', () => {
    const props = {
      ChartTypes,
      showChartId: 'Depth',
      changeChartType: () => {}
    };
    const wrapper = shallow(<ChartSwitch {...props} />);
    expect(wrapper.find('.ChartSwitch--button').length).toEqual(2);
  });

  it('should highlight supplied showChartId display ChartType Title', () => {
    const props = {
      ChartTypes,
      showChartId: 'MarketChart',
      changeChartType: () => {}
    };
    const wrapper = shallow(<ChartSwitch {...props} />);
    const activeButton = wrapper.find('.ChartSwitch--button--active');
    expect(activeButton.length).toEqual(1);
    expect(activeButton.text()).toEqual(ChartTypes.MarketChart.title);
  });

  it('Clicking a ChartSwitch button should call the changeChartType function', () => {
    const mockChangeChartType = jest.fn();
    const props = {
      ChartTypes,
      showChartId: 'Depth',
      changeChartType: mockChangeChartType
    };
    const wrapper = shallow(<ChartSwitch {...props} />);
    wrapper
      .find('.ChartSwitch--button')
      .first()
      .simulate('click');
    expect(mockChangeChartType.mock.calls.length).toEqual(1);
  });
});
