import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import './HelpTip.scss';

class HelpTip extends React.PureComponent {
  static propTypes = {
    children: PropTypes.oneOfType([PropTypes.node, PropTypes.array]).isRequired,
    compact: PropTypes.bool,
    handle: PropTypes.node
  };

  constructor(props) {
    super(props);

    this.state = {
      hover: false
    };

    this.handleMouseOver = this.handleMouseOver.bind(this);
    this.handleMouseOut = this.handleMouseOut.bind(this);
  }

  handleMouseOver() {
    this.setState({
      hover: true
    });
  }

  handleMouseOut() {
    this.setState({
      hover: false
    });
  }

  render() {
    const contentClassName = classnames('HelpTip__content', {
      'HelpTip__content--compact': this.props.compact,
      'HelpTip__content--is-visible': this.state.hover
    });

    return (
      <span className="HelpTip" onMouseOver={this.handleMouseOver} onMouseOut={this.handleMouseOut}>
        {this.props.handle ? this.props.handle : <span className="HelpTip__icon">?</span>}
        <span className={contentClassName}>{this.state.hover && this.props.children}</span>
      </span>
    );
  }
}

export { HelpTip };
