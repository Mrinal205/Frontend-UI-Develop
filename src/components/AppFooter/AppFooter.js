import React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faRedditAlien,
  faTelegramPlane,
  faFacebook,
  faTwitter,
  faMedium
} from '@fortawesome/free-brands-svg-icons';

import './AppFooter.scss';

const FooterLinks = [
  {
    display: 'Homepage',
    link: 'https://www.moonassist.com/'
  },
  {
    display: 'About',
    link: 'https://www.moonassist.com/about-us'
  },
  {
    display: 'Terms of service',
    link: 'https://www.moonassist.com/terms-and-conditions'
  },
  {
    display: 'Privacy policy',
    link: 'https://www.moonassist.com/privacy-policy'
  },
  {
    display: 'Support',
    link: 'https://www.moonassist.com/support'
  },
  {
    display: 'FAQ',
    link: 'https://www.moonassist.com/support#faq'
  },
  {
    display: 'News',
    link: 'https://www.medium.com/moonassist'
  }
];

const SocialLinks = [
  { href: 'https://reddit.com/r/moonassist/', icon: faRedditAlien },
  { href: 'https://www.t.me/moonassist', icon: faTelegramPlane },
  { href: 'https://www.facebook.com/moonassist', icon: faFacebook },
  { href: 'https://www.twitter.com/moon_assist', icon: faTwitter },
  { href: 'https://www.medium.com/moonassist', icon: faMedium }
];

export const SocialMediaLinks = () => {
  return (
    <div className="SocialMediaLinks">
      {SocialLinks.map(link => (
        <a key={link.href} href={link.href} className="AppFooter__Link" onClick={openExternalLink}>
          <FontAwesomeIcon icon={link.icon} size="lg" />
        </a>
      ))}
    </div>
  );
};

function openExternalLink(event) {
  event.preventDefault();
  window.open(event.currentTarget['href']);
}

export const AppFooter = ({ extended = true }) => (
  <div className={`AppFooter ${extended ? 'AppFooter--extended' : ''}`}>
    {extended && (
      <div>
        <ul className="AppFooter__List">
          {FooterLinks.map(item => (
            <li key={item.display} className="AppFooter__List-item">
              <a
                href={item.link}
                className="AppFooter__List-link link-secondary"
                onClick={openExternalLink}
              >
                {item.display}
              </a>
            </li>
          ))}
        </ul>
        <p className="AppFooter__Legend">
          Moon Assist lets you trade like a professional using a single platform, integrating with
          your favorite exchanges.
          <br />
          We make it easy to get control over your wide portfolio, trade safely, and maximize
          profits.
        </p>
      </div>
    )}

    <div className={`AppFooter__SocialMedia`}>
      <SocialMediaLinks />
    </div>

    <div className="AppFooter__Info">
      {extended ? '© All rights reserved by Moon Assist 2018' : '© Moon Assist 2018'}
    </div>

    {extended && <div className="AppFooter__Closing-text">In crypto we trust</div>}
  </div>
);

export default AppFooter;
