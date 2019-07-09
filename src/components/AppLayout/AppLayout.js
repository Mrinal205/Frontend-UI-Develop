import React from 'react';

import AppHeader from 'components/AppHeader/AppHeader';
import AppFooter from 'components/AppFooter/AppFooter';

import './AppLayout.scss';

export class AppLayout extends React.Component {
  static defaultProps = {
    displaFooter: true
  };

  render() {
    return (
      <div className="App">
        <div className="App__header">
          <AppHeader />
        </div>
        <div className="App__content">{this.props.children}</div>
        {this.props.displaFooter && (
          <div className="App__footer">
            <AppFooter />
          </div>
        )}
      </div>
    );
  }
}

export default AppLayout;
