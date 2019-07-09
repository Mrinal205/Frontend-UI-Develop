import React from 'react';

import { FormField } from 'components/FormField';
// import { Hint } from 'components/Hint';

const isChecked = (subscriptionList, type) => {
  return subscriptionList.filter(i => i.type === type).length > 0;
};

export const NotificationsForm = ({ onInputChange, emailSubscriptions = [] }) => {
  return (
    <div className="form">
      <div className="form__row">
        <div className="form__checkbox-row">
          <FormField
            type="checkbox"
            input={{
              name: 'notification_NEWSLETTER',
              value: 'NEWSLETTER',
              checked: isChecked(emailSubscriptions, 'NEWSLETTER'),
              onChange: onInputChange
            }}
            label="Receive Moon Assist Newsletter"
          />
        </div>
      </div>

      <div className="form__row">
        <div className="form__checkbox-row">
          <FormField
            type="checkbox"
            input={{
              name: 'notification_LOGIN',
              value: 'LOGIN',
              checked: isChecked(emailSubscriptions, 'LOGIN'),
              onChange: onInputChange
            }}
            label="Receive Login notifications"
          />
        </div>
      </div>
    </div>
  );
};

export default NotificationsForm;
