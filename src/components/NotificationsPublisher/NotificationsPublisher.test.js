import React from 'react';
import { mount } from 'enzyme';
import { NotificationsPublisher } from './NotificationsPublisher';

describe('NotificationsPublisher component', () => {
  const props = {
    removeNotification: jest.fn(),
    notifications: {
      list: {
        1: {
          id: 1,
          notification: {
            symbolPair: 'ETH-BTC',
            amount: 1.0234632575,
            orderType: 'market'
          }
        }
      }
    }
  };
  const wrapper = mount(<NotificationsPublisher {...props} />);
  it('renders <NotificationsPublisher /> without crashing', () => {
    expect(wrapper).toBeDefined();
  });
  it('renders a notification', () => {
    expect(wrapper.find('.NotificationsPublisher__Notification').length).toEqual(1);
  });
});
