import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { noop } from 'lodash';

import { isEmptyValue, formatPercentage } from '_helpers';

import './StepSelector.scss';

class StepSelector extends Component {
  static propTypes = {
    formType: PropTypes.string,
    values: PropTypes.array,
    showInput: PropTypes.bool,
    input: PropTypes.shape({
      value: PropTypes.any,
      onChange: PropTypes.func
    })
  };

  static defaultProps = {
    formType: 'default',
    showInput: true,
    values: [0, 25, 50, 75, 100],
    min: 0,
    max: 100,
    stepsEvery: 25,
    snap: 2,
    input: {
      value: null,
      onChange: noop
    }
  };

  constructor(props) {
    super(props);

    const { value } = props.input;
    this.state = {
      selectedValue: isEmptyValue(value) ? null : value
    };
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.input.value !== this.props.input.value) {
      this.selectValue(nextProps.input.value);
    }
  }

  onMouseDown(event) {
    this.barPosition = this.refs.options.getBoundingClientRect();
    window.addEventListener('mousemove', this.onMouseMove);
    window.addEventListener('mouseup', this.onMouseUp);
    this.calculateValue(event);
  }

  onMouseUp(event) {
    window.removeEventListener('mousemove', this.onMouseMove);
    window.removeEventListener('mouseup', this.onMouseUp);
    this.calculateValue(event, true);
  }

  onMouseMove(event) {
    this.calculateValue(event);
  }

  calculateValue(event, propagate = false) {
    const { stepsEvery, snap } = this.props;
    const { left, right, width } = this.barPosition;

    // limit the mouse position within the options limit
    const mouseX = Math.min(Math.max(event.pageX, left), right);
    // get the delta from 0%
    const deltaX = mouseX - left;
    // calculate percentage
    let percentage = Math.round((deltaX * 100) / width);
    // check if close to a stop point
    const module = percentage % stepsEvery;
    if (module <= snap || module >= stepsEvery - snap) {
      percentage = Math.round(percentage / stepsEvery) * stepsEvery;
    }

    this.selectValue(percentage, propagate);
  }

  selectValue(value, propagate) {
    this.setState({ selectedValue: isEmptyValue(value) ? null : value });
    if (propagate && typeof this.props.input.onChange === 'function') {
      this.props.input.onChange(value);
    }
  }

  onTextInputChange(event) {
    this.selectValue(event.target.value, true);
  }

  render() {
    const { input, formType, showInput, max, min } = this.props;
    const { selectedValue } = this.state;

    const displayValue = formatPercentage(Math.max(Math.min(Number(selectedValue), max), min));
    return (
      <div className={`StepSelector StepSelector--${formType}`}>
        <div
          className="StepSelector__options"
          ref="options"
          onMouseDown={this.onMouseDown.bind(this)}
        >
          {this.props.values.map((value, index) => {
            return (
              <span
                key={index}
                className={classNames('StepSelector__option', {
                  'StepSelector__option-selected': selectedValue !== null && value <= selectedValue
                })}
                onClick={this.selectValue.bind(this, value)}
              >
                <span className="StepSelector__option-label">{value}%</span>
              </span>
            );
          })}
          {selectedValue !== null && (
            <span
              className="StepSelector__mark"
              style={{ left: `${displayValue}%` }}
              title={`${displayValue}%`}
            />
          )}
          <div className="StepSelector__options-selected" style={{ width: `${displayValue}%` }} />
        </div>
        {showInput && (
          <span className="StepSelector__field-container">
            <input
              type="number"
              className="StepSelector__field"
              onChange={this.onTextInputChange.bind(this)}
              value={selectedValue !== null ? `${displayValue}` : ''}
            />
          </span>
        )}
      </div>
    );
  }
}

export default StepSelector;
