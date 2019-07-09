import React, { Component } from 'react';
import ReactSelect from 'react-select';
import classNames from 'classnames';
import { get } from 'lodash/object';

// import 'react-select/dist/react-select.css';
import './Select.scss';

export class Select extends Component {
  formatValue(value) {
    if (typeof value === 'string') {
      return { label: value, value };
    }
    return value;
  }

  formatOptions(options = []) {
    return options.map(this.formatValue);
  }

  onInputChange(item) {
    const value = item.value || item;
    this.props.input.onChange(value);
  }

  render() {
    const {
      value,
      options,
      size,
      className,
      // input is available when this component is part of a redux-form
      input = {},
      ...restProps
    } = this.props;

    // when within redux-forms, we need to override the onChange callback
    if (typeof get(this.props, 'input.onChange') === 'function') {
      restProps.onChange = this.onInputChange.bind(this);
    }

    const cssClasses = classNames(
      'Select--moon',
      {
        'Select--moon-large': size === 'large'
      },
      className
    );

    return (
      <ReactSelect
        onBlurResetsInput={false}
        value={this.formatValue(input.value || value)}
        options={this.formatOptions(options)}
        className={cssClasses}
        {...restProps}
      />
    );
  }
}

export default Select;
