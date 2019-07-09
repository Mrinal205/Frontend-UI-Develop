import React from 'react';
import PropTypes from 'prop-types';

const CryptocurrencyIcon = ({ icon, size = 16 }) => {
  try {
    return (
      <img
        width={size}
        height={size}
        src={require(`cryptocurrency-icons/svg/color/${icon.toLowerCase()}.svg`)}
        alt={icon}
      />
    );
  } catch (e) {
    return (
      <img
        width={size}
        height={size}
        src={require(`cryptocurrency-icons/svg/color/generic.svg`)}
        alt={icon}
      />
    );
  }
};

CryptocurrencyIcon.propTypes = {
  icon: PropTypes.string
};

export default CryptocurrencyIcon;
