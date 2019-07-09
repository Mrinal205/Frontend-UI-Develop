import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Button } from 'components/Button/Button';

import './ErrorBoundary.scss';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ hasError: true });
    if (window.Raven) {
      window.Raven.captureException(error, { extra: errorInfo });
    }
  }

  renderRetry() {
    const { retry = 'Try again' } = this.props;
    return (
      <div className="ErrorBoundary__retry">
        <Button small onClick={() => this.setState({ hasError: false })}>
          {retry}
        </Button>
      </div>
    );
  }

  render() {
    if (this.state.hasError) {
      const { errorMessage } = this.props;
      return (
        <div className="ErrorBoundary">
          <strong>
            <span role="img" aria-label="Aww, snap!">
              🤬
            </span>
            Something went wrong!
          </strong>
          {this.props.errorMessage && <p className="ErrorBoundary__message">{errorMessage}</p>}
          {this.props.retry && this.renderRetry()}
        </div>
      );
    }
    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  retry: PropTypes.string,
  errorMessage: PropTypes.string
};

ErrorBoundary.defaultProps = {
  errorMessage: 'Someting went wrong with this component'
};

export default ErrorBoundary;
