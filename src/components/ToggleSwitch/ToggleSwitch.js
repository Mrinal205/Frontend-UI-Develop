import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import './ToggleSwitch.scss';

class ToggleSwitch extends Component {
  static propTypes = {
    input: PropTypes.shape({
      value: PropTypes.boolean,
      onChange: PropTypes.func
    }),
    offerType: PropTypes.string
  };

  render() {
    const {
      input: { value, onChange },
      offerType
    } = this.props;

    return (
      <div
        className={classNames(`ToggleSwitch ToggleSwitch--${offerType}`, {
          'ToggleSwitch--selected': Boolean(value)
        })}
        onClick={onChange.bind(null, !value)}
      />
    );
  }
}

export default ToggleSwitch;
