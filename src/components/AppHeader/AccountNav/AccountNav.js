import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { logoutUser } from '_actions/user.actions';

import './AccountNav.scss';

export class AccountNav extends React.PureComponent {
  constructor(props) {
    super(props);
    this.handleLogoutClick = this.handleLogoutClick.bind(this);
  }

  handleLogoutClick(event) {
    event.preventDefault();
    this.props.dispatch(logoutUser());
  }

  render() {
    const { personalDetails } = this.props.account;
    const { name } = personalDetails;

    return (
      <div className="AccountNav">
        <div className="AccountNav__profile">
          <div className="AccountNav__avatar" />
          <div className="AccountNav__greet">
            <div className="AccountNav__name">{name === '' ? 'Hello Mooner!' : name}</div>
            {/*<Link to="/account/subscriptions" className="AccountNav__subscription">
              Upgrade account
            </Link>*/}
          </div>
        </div>
        <nav className="AccountNav__menu">
          <a href="https://www.moonassist.com/support" className="AccountNav__link">
            <i className="AccountNav__link-icon AccountNav__link-icon--support" />
            <span className="AccountNav__link-label">Support</span>
          </a>
          <Link to="/account/summary" className="AccountNav__link">
            <i className="AccountNav__link-icon AccountNav__link-icon--account" />
            <span className="AccountNav__link-label">Account</span>
          </Link>
          <a href="/" onClick={this.handleLogoutClick} className="AccountNav__link">
            <i className="AccountNav__link-icon AccountNav__link-icon--logout" />
            <span className="AccountNav__link-label">Logout</span>
          </a>
        </nav>
      </div>
    );
  }
}

const mapsStateToProps = ({ account }) => ({ account });

export default connect(mapsStateToProps)(AccountNav);
