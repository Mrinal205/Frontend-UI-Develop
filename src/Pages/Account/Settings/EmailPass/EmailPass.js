import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'components/Button/Button';

import './EmailPass.scss';

export const EmailPass = ({ user, requestPasswordChange, requestEmailChange }) => (
  <div className="EmailPass">
    <ul className="EmailPass__list">
      <li className="EmailPass__item">
        <strong className="EmailPass__label">Registered email:</strong>
        <span className="EmailPass__value">{user.email}</span>
        <div className="EmailPass__item--button-container" />
      </li>
      <li className="EmailPass__item">
        <strong className="EmailPass__label">Password:</strong>
        <span className="EmailPass__value">****************</span>
        <div className="EmailPass__item--button-container">
          <Link to="/account/settings/edit/password">
            <Button small>Change Password</Button>
          </Link>
        </div>
      </li>
    </ul>
  </div>
);

export default EmailPass;
