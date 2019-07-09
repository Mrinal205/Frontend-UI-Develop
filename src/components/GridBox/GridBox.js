import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import Spinner from 'components/Spinner/Spinner';

import './GridBox.scss';

export class GridBox extends React.Component {
  static propTypes = {
    name: PropTypes.string,
    title: PropTypes.string,
    aside: PropTypes.node,
    children: PropTypes.node,
    transparent: PropTypes.bool,
    loading: PropTypes.bool
  };

  renderHeadline() {
    return (
      <div className="GridBox__headline">
        <h2 className="GridBox__title">{this.props.title}</h2>
        {this.props.aside && <div className="GridBox__aside">{this.props.aside}</div>}
      </div>
    );
  }

  renderLoading() {
    return (
      <div
        className={`GridBox__loading GridBox__loading--${
          this.props.loadingStyle ? this.props.loadingStyle : 'default'
        }`}
      >
        <Spinner color="blue" />
        <p>{this.props.loadingMessage}</p>
      </div>
    );
  }

  renderContent() {
    return (
      <React.Fragment>
        {this.props.title && this.renderHeadline()}
        {this.props.children}
      </React.Fragment>
    );
  }

  render() {
    const className = classnames('GridBox', {
      'GridBox--transparent': this.props.transparent,
      'GridBox--loading': this.props.loading,
      [`GridBox--${this.props.name}`]: this.props.name
    });

    return (
      <div className={className}>
        {this.props.loading ? this.renderLoading() : this.renderContent()}
      </div>
    );
  }
}

export default GridBox;
