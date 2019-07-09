import React from 'react';

import './InlineLabel.scss';

const InlineLabel = ({ type = 'info', minWidth = 'auto', align = 'center', children }) => {
  const style = {
    minWidth,
    textAlign: align
  };
  return (
    <span className={`InlineLabel InlineLabel--${type}`} style={style}>
      {children}
    </span>
  );
};

export default InlineLabel;
