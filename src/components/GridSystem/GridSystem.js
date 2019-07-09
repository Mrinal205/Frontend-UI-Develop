import React from 'react';
import classnames from 'classnames';

import './GridSystem.scss';

export const Container = ({ children, className = '' }) => (
  <div className={classnames('Container', className)}>{children}</div>
);

export const Row = ({ children, className = '', noMargin }) => (
  <div
    className={classnames('Row', className, {
      'Row--no-margin': noMargin
    })}
  >
    {children}
  </div>
);

export const Col = ({ children, size, overflow, className = '', noMargin, grow, alignRight }) => {
  const colClassName = classnames('Col', className, {
    [`Col--size-${size}`]: size !== undefined,
    'Col--overflow': overflow,
    'Col--no-margin': noMargin,
    'Col--grow': grow,
    'Col--align-right': alignRight
  });

  return <div className={colClassName}>{children}</div>;
};
