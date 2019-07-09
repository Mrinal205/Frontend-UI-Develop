import React from 'react';
import { NotificationTypes, OrderTypes } from '_constants';
import { getTradingPair, truncateNumber } from '_helpers';

import CloseButton from 'assets/close-button.svg';
import './NotificationsPublisher.scss';

const NotificationColors = {
  [NotificationTypes.ORDER_FILLED]: 'positive',
  [NotificationTypes.ORDER_CANCELED]: 'negative'
};

export class NotificationsPublisher extends React.Component {
  renderMessage(notification) {
    let status = 'filled';
    if (notification.type === NotificationTypes.ORDER_PLACED) {
      status = 'placed';
    } else if (notification.type === NotificationTypes.ORDER_CANCELED) {
      status = 'canceled';
    }
    const amount = truncateNumber(notification.amount);
    const { base, quote } = getTradingPair(notification.symbolPair);
    const rate =
      notification.orderType.toLowerCase() === OrderTypes.MARKET
        ? 'Market Price'
        : notification.price;
    return `Your ${notification.orderType} ${
      notification.offerType
    } order of ${amount} ${base} at ${rate} ${quote} has been ${status}.`;
  }

  renderNotification({ notification, duration, id }) {
    const { removeNotification } = this.props;
    const durationStyle = { animationDuration: `${duration - 200}ms` };

    return (
      <div className="NotificationsPublisher__Notification" key={id} style={durationStyle}>
        <div
          className="NotificationsPublisher__Notification--close"
          onClick={removeNotification.bind(null, id)}
        >
          <img src={CloseButton} alt="" />
        </div>
        <div className="NotificationsPublisher__Notification--header">
          <span className="NotificationsPublisher__Notification--header--label">
            {(notification.orderType || '').toLowerCase()}{' '}
            {(notification.offerType || '').toLowerCase()}
          </span>
          <span className="NotificationsPublisher__Notification--header--title">
            {notification.symbolPair} {notification.type}
          </span>
        </div>
        <div className="NotificationsPublisher__Notification--body">
          {this.renderMessage(notification)}
        </div>
        <div
          className={`NotificationsPublisher__Notification--bar type-${
            NotificationColors[notification.type]
          }`}
          style={durationStyle}
        />
      </div>
    );
  }

  render() {
    const {
      notifications: { list = {} }
    } = this.props;
    const ids = Object.keys(list).sort((a, b) => a.id - b.id);

    return (
      <div className="NotificationsPublisher">
        {ids.map(id => this.renderNotification(list[id], id))}
      </div>
    );
  }
}

export default NotificationsPublisher;
