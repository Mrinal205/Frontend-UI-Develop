import React from 'react';

import './LoginHistory.scss';

const LoginHistory = ({ loginEvents = [], limit }) => {
  if (loginEvents.length === 0) {
    return (
      <div className="LoginHistory">
        <p>Looks like its your first login!</p>
      </div>
    );
  }

  const loginEventsForDisplay = limit ? loginEvents.slice(0, limit) : loginEvents;

  return (
    <div className="LoginHistory">
      <table className="table">
        <thead>
          <tr>
            <th scope="col" className="table__col table__col--date">
              Date &amp; time
            </th>
            <th scope="col" className="table__col table__col--ip">
              IP Address
            </th>
            <th scope="col" className="table__col table__col--browser">
              Browser
            </th>
          </tr>
        </thead>
        <tbody>
          {loginEventsForDisplay.map((loginEvent, index) => (
            <tr key={`lge-${index}`} className="LoginHistory__event">
              <td>{loginEvent.date}</td>
              <td>{loginEvent.ipAddress}</td>
              <td>{loginEvent.userAgent}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LoginHistory;
