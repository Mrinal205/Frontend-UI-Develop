import React from 'react';
import { NavLink } from 'react-router-dom';

import AccountNav from './AccountNav/AccountNav';

import './AppHeader.scss';

// array of links used for navigation
const links = ['Dashboard', 'Market', 'Wallet'];

export class AppHeader extends React.Component {
  render() {
    return (
      <div className="AppHeader">
        <div className="AppHeader__logoContainer">
          <div className="AppHeader__logo" />
          <div className="AppHeader__alphaLogo" />
        </div>

        <nav className="AppHeader__nav">
          {links.map((item, i) => (
            <NavLink
              key={`nav-item-${i}`}
              to={`/${item.toLowerCase()}`}
              className="AppHeader__nav-link"
              activeClassName="AppHeader__nav-link--is-active"
            >
              <i
                className={`AppHeader__nav-link-icon AppHeader__nav-link-icon--${item.toLowerCase()}`}
              />
              <span className="AppHeader__nav-link-label">{item}</span>
            </NavLink>
          ))}
        </nav>
        <div className="AppHeader__account">
          <AccountNav />
        </div>
      </div>
    );
  }
}

export default AppHeader;
