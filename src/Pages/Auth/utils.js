import React from 'react';

import Spinner from 'components/Spinner';

export const Loading = () => (
  <div className="PublicArea__loading">
    <Spinner size="big" color="blue" />
  </div>
);

export const ErrorMessage = ({ error }) => <div className="PublicArea__error">{error}</div>;
