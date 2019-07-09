import React from 'react';

import './NotFound.scss';

export class NotFound extends React.Component {
  render() {
    return (
      <div className="NotFound__container">
        <div className="NotFound__subtitle">Error 404</div>
        <h1 className="NotFound__mainHeader">Houston, we have a problem</h1>
      </div>
    );
  }
}

export default NotFound;
