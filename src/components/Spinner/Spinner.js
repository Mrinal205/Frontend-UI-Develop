import React from 'react';
import classnames from 'classnames';

import './Spinner.scss';

class Spinner extends React.Component {
  render() {
    let bars = [];
    for (let i = 0; i < 12; i++) {
      bars.push(<span className={`Spinner__bar Spinner__bar--b${i}`} key={i} />);
    }

    const spinnerClassNames = classnames(
      {
        Spinner: true,
        'Spinner--is-small': this.props.size === 'small',
        'Spinner--is-big': this.props.size === 'big',
        'Spinner--color-red': this.props.color === 'red',
        'Spinner--color-blue': this.props.color === 'blue',
        'Spinner--color-green': this.props.color === 'green'
      },
      this.props.className
    );

    return (
      <span {...this.props} className={spinnerClassNames}>
        {bars}
      </span>
    );
  }
}

export default Spinner;
