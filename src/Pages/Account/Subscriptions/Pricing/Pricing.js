import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-regular-svg-icons';

import json from './Pricing.json';
import './Pricing.scss';

class Price extends React.Component {
  render() {
    const { months, price } = this.props;
    const moreThan1 = months > 1;
    const monthSuffix = moreThan1 ? 's' : '';
    return (
      <div className="Pricing__category">
        <div className="Pricing__category--timeframe">
          {months} Month{monthSuffix}
        </div>
        <div className="Pricing__category--monthly">
          <span className="Pricing__category--monthly__currency">$</span>
          <span className="Pricing__category--monthly__ammount">{price}</span>
          <span className="Pricing__category--monthly__unit"> / Month</span>
        </div>
        <p className="Pricing__category--explaination">
          (${price * months} charged every {moreThan1 ? months : ''} month{monthSuffix})
        </p>
      </div>
    );
  }
}

class Feature extends React.Component {
  render() {
    const { text, modifier, checked } = this.props;
    const _modifier = modifier || 'normal';
    return (
      <div className={`Pricing__feature Pricing__feature--${_modifier}`}>
        {text}
        {checked ? (
          <FontAwesomeIcon className="fa-space-left" icon={faCheckCircle} size="lg" />
        ) : null}
      </div>
    );
  }
}

export class Pricing extends React.Component {
  render() {
    const { features, prices } = json;
    return (
      <div className="Pricing">
        <div className="Pricing__categories">
          {prices.map((item, index) => {
            return <Price key={index} {...item} />;
          })}
        </div>
        <div className="Pricing__features">
          {Object.keys(features).map((key, index) => {
            return <Feature key={index} {...features[key]} />;
          })}
        </div>
      </div>
    );
  }
}

export default Pricing;
