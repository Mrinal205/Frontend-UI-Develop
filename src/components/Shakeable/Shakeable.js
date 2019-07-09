import React from 'react';

class Shakeable extends React.Component {
  state = {
    shake: false
  };

  UNSAFE_componentWillReceiveProps(nextProps) {
    this.setState({ shake: nextProps.shouldShake });
  }

  onAnimationEnd = () => {
    this.setState({ shake: false });
  };

  render() {
    return (
      <div
        className={this.state.shake ? 'animated shake' : ''}
        onAnimationEnd={this.onAnimationEnd}
      >
        {this.props.children}
      </div>
    );
  }
}

export { Shakeable };
