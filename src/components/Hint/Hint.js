import React from 'react';

import './Hint.scss';

const Hint = ({ type = 'info', children }) => (
  <div className={`Hint Hint--${type}`}>
    <p className={`Hint__message Hint__message--is-${type}`}>{children}</p>
  </div>
);

export { Hint };
