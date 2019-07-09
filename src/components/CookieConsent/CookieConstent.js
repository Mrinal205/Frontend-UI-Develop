import React from 'react';

import 'cookieconsent/build/cookieconsent.min.js';
import 'cookieconsent/build/cookieconsent.min.css';
import './CookieConsent.scss';

export default class CookieConstent extends React.Component {
  componentDidMount() {
    window.cookieconsent.initialise({
      palette: {
        popup: {
          background: '#12233a'
        },
        button: {
          background: '#0081FF'
        }
      },
      theme: 'edgeless',
      position: 'top',
      static: true,
      type: 'opt-in',
      content: {
        href: 'https://www.moonassist.com/cookie-policy'
      },
      onPopupOpen: function() {
        document.body.classList.add('with-cc');
      },
      onPopupClose: function() {
        document.body.classList.remove('with-cc');
      }
    });
  }

  render() {
    return false;
  }
}
