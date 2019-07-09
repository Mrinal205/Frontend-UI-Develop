import React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import {
  faBitcoin,
  faRedditAlien,
  faTelegramPlane,
  faFacebook,
  faTwitter,
  faMedium
} from '@fortawesome/free-brands-svg-icons';

const SocialLinks = [
  { href: 'https://bitcointalk.org/', icon: faBitcoin },
  { href: 'https://reddit.com/r/moonassist/', icon: faRedditAlien },
  { href: 'https://www.t.me/moonassist', icon: faTelegramPlane },
  { href: 'https://www.facebook.com/moonassist', icon: faFacebook },
  { href: 'https://www.twitter.com/moon_assist', icon: faTwitter },
  { href: 'https://www.medium.com/moonassist', icon: faMedium }
];

function openExternalLink(event) {
  event.preventDefault();
  window.open(event.currentTarget['href']);
}

export const SocialMedia = ({ extended = true }) => (
  <div className={`SocialMedia ${extended ? 'SocialMedia--extended' : ''}`}>
    <div className={`SocialMedia__SocialMedia`}>
      {SocialLinks.map(link => (
        <a
          key={link.href}
          href={link.href}
          className="SocialMedia__Link"
          onClick={openExternalLink}
        >
          <FontAwesomeIcon icon={link.icon} size="lg" />
        </a>
      ))}
    </div>

    <div className="copyrightContainer">
      <div className="copyright">© Moon Assist 2018</div>
    </div>
  </div>
);

export default SocialMedia;
