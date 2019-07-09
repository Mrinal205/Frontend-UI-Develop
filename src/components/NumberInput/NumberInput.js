import React, { Component } from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';

import { safeNumericValue, formatCryptocurrency, formatDecimalString } from '_helpers';
import { scientificToDecimal } from '_helpers/formatting';

import './NumberInput.scss';

class NumberInput extends Component {
  static propTypes = {
    min: PropTypes.number,
    max: PropTypes.number,
    input: PropTypes.object,
    floatingLabel: PropTypes.bool,
    label: PropTypes.string,
    unit: PropTypes.string,
    className: PropTypes.string,
    meta: PropTypes.object,
    step: PropTypes.number,
    spinButton: PropTypes.bool,
    precision: PropTypes.number
  };

  static defaultProps = {
    spinButton: false
  };

  componentDidMount() {
    this.refs.input.addEventListener('mousewheel', ignoreEvent);
  }

  componentWillUnmount() {
    this.refs.input.removeEventListener('mousewheel', ignoreEvent);
  }

  onSpinClick(delta) {
    const {
      input: { value, onChange },
      min,
      max
    } = this.props;

    const newValue = safeNumericValue(value) + delta;
    if (
      (typeof min === 'undefined' || newValue >= min) &&
      (typeof max === 'undefined' || newValue <= max)
    ) {
      onChange(newValue);
    }
  }

  generateHandleChange = precision => e => {
    e.target.value = formatDecimalString(precision, e.target.value);
    this.props.input.onChange(e);
  };

  formatValue = val => {
    const { precision } = this.props;
    const formatted = formatCryptocurrency(val);
    if (typeof val === 'string' && (val.includes('e') || val.includes('E'))) {
      return formatDecimalString(precision, scientificToDecimal(formatted));
    } else {
      return formatDecimalString(precision, formatted);
    }
  };

  render() {
    const {
      input,
      label,
      floatingLabel,
      meta,
      className,
      step,
      spinButton,
      unit,
      precision,
      ...restProps
    } = this.props;
    return (
      <React.Fragment>
        {floatingLabel && <span className="NumberInput__floatingLabel">{label}</span>}
        <input
          {...restProps}
          ref="input"
          step={step}
          type="text"
          value={this.formatValue(input.value)}
          onFocus={input.onFocus}
          onBlur={input.onBlur}
          onChange={this.generateHandleChange(precision)}
          className={classnames('NumberInput', className, {
            'NumberInput--with-spin': spinButton,
            'NumberInput--with-unit': Boolean(unit),
            'NumberInput--with-floating-label': floatingLabel
          })}
          onKeyPress={e => {
            // prevent submit on enter
            if (e.key === 'Enter') e.preventDefault();
          }}
        />
        {Boolean(unit) && <span className="NumberInput__unit">{unit}</span>}
        {spinButton && (
          <div className="NumberInput__spin-button">
            <span
              className="NumberInput__spin-button-up"
              onClick={this.onSpinClick.bind(this, step)}
            />
            <span
              className="NumberInput__spin-button-down"
              onClick={this.onSpinClick.bind(this, -step)}
            />
          </div>
        )}
      </React.Fragment>
    );
  }
}

export default NumberInput;

function ignoreEvent(e) {
  e.preventDefault();
}
