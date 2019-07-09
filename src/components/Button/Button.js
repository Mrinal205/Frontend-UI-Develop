import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import Spinner from 'components/Spinner';

import './Button.scss';

const Button = ({
  danger,
  small,
  hollow,
  micro,
  block,
  loading,
  className,
  children,
  tiny,
  neutral,
  outlined,
  ...rest
}) => {
  const buttonClassNames = classNames(
    'Button',
    {
      'Button--danger': danger,
      'Button--small': small,
      'Button--tiny': tiny,
      'Button--micro': micro,
      'Button--block': block,
      'Button--loading': loading,
      'Button--hollow': hollow,
      'Button--neutral': neutral,
      'Button--outlined': outlined
    },
    className
  );

  return (
    <button className={buttonClassNames} {...rest}>
      <span className="Button__label">{children}</span>
      {loading && <Spinner className="Button__spinner" />}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  danger: PropTypes.bool,
  small: PropTypes.bool,
  block: PropTypes.bool,
  outlined: PropTypes.bool,
  loading: PropTypes.bool
};

export { Button };
export default Button;
