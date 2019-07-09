import { default as React, Component } from 'react';
import PropTypes from 'prop-types';

import InfoCircle from 'assets/info-circle.svg';

import './HelpTooltip.scss';

export default class HelpTooltip extends Component {
  static propTypes = {
    text: PropTypes.node
  };

  constructor(props) {
    super(props);
    this.state = { visibleTooltip: false };
  }

  showTooltip() {
    this.setState({ visibleTooltip: true });
  }

  hideTooltip() {
    this.setState({ visibleTooltip: false });
  }

  render() {
    return (
      <span className="HelpTooltip">
        <img
          alt=""
          className="HelpTooltip__icon"
          src={InfoCircle}
          onMouseEnter={this.showTooltip.bind(this)}
          onMouseLeave={this.hideTooltip.bind(this)}
        />
        {this.state.visibleTooltip && <div className="HelpTooltip__bubble">{this.props.text}</div>}
      </span>
    );
  }
}
