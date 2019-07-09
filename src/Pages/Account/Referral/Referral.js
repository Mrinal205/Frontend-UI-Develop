import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';

export class Referral extends React.Component {
  render() {
    const title = 'Referral';
    return (
      <div className="content">
        <Helmet>
          <title>{title} - Moon Assist</title>
        </Helmet>

        <div className="content__header">
          <h1 className="content__title">{title}</h1>
        </div>

        <div className="content__body">
          <div className="content__section content__section">
            <p>Stay tuned! Moon Assist's referral program is coming!</p>
            <p>
              Soon you will be able to earn rewards and discounts.<br />
              Subscribe to our newsletter and we'll let you know when the program is ready.
            </p>
            <p>
              {'Visit settings and '}
              <Link to="/account/settings">check your newsletter prefferences</Link>
              .
            </p>
          </div>
        </div>
      </div>
    );
  }
}

export default Referral;
