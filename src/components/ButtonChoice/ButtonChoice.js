import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import './ButtonChoice.scss';

class ButtonChoice extends Component {
  static propTypes = {
    formType: PropTypes.string,
    values: PropTypes.array,
    input: PropTypes.shape({
      value: PropTypes.string,
      onChange: PropTypes.func
    })
  };

  static defaultProps = {
    formType: 'default'
  };

  render() {
    const { input, formType } = this.props;
    return (
      <div className={`ButtonChoice ButtonChoice--${formType}`}>
        {this.props.values.map((value, index) => {
          const className = classNames('ButtonChoice__button', {
            'ButtonChoice__button--selected': input.value === value
          });

          return (
            <button
              key={index}
              className={className}
              onClick={e => {
                e.preventDefault();
                input.onChange(value);
              }}
            >
              {value}
            </button>
          );
        })}
      </div>
    );
  }
}

export default ButtonChoice;
