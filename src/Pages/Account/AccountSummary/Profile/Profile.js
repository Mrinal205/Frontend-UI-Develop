import React from 'react';

import './Profile.scss';

const Profile = ({ account, user }) => {
  const { personalDetails = {} } = account;
  const { name } = personalDetails;

  return (
    <div className="Profile">
      <div className="Profile__avatar" />
      <div className="Profile__info">
        <div className="Profile__name">{name === '' ? 'Hello Mooner!' : `Hello ${name}!`}</div>
        <dl className="Profile__details">
          <dt>Email</dt>
          <dd>
            {user.email} <span className="Profile__label label">Verified</span>
          </dd>
        </dl>
      </div>
    </div>
  );
};

export default Profile;
