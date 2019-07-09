import React from 'react';
import { shallow } from 'enzyme';
import LoginHistory from './LoginHistory';

it('renders LoginHistory component without crashing', () => {
  const wrapper = shallow(<LoginHistory />);

  expect(wrapper.hasClass('LoginHistory')).toBe(true);
});

it('renders LoginHistory events table', () => {
  const mockedLoginEvents = [
    {
      date: '28-12-2017 01:02:03',
      ipAddress: '192.168.0.1',
      userAgent: 'Mzilla/5.0 (Macintosh; Intel...'
    },
    {
      date: '01-01-2018 13:37:00',
      ipAddress: '127.0.0.1',
      userAgent: 'Mzilla/5.0 (Macintosh; Intel...'
    }
  ];

  const wrapper = shallow(<LoginHistory loginEvents={mockedLoginEvents} />);
  expect(wrapper.find('.LoginHistory__event').length).toEqual(2);
});

it('renders limited amount of events in a table', () => {
  const mockedLoginEvents = [
    {
      date: '28-12-2017 01:02:03',
      ipAddress: '192.168.0.1',
      userAgent: 'Mzilla/5.0 (Macintosh; Intel...'
    },
    {
      date: '01-01-2018 13:37:00',
      ipAddress: '127.0.0.1',
      userAgent: 'Mzilla/5.0 (Macintosh; Intel...'
    },
    {
      date: '01-01-2018 21:37:00',
      ipAddress: '127.0.0.1',
      userAgent: 'Mzilla/5.0 (Macintosh; Intel...'
    }
  ];

  const wrapper = shallow(<LoginHistory loginEvents={mockedLoginEvents} limit={2} />);
  expect(wrapper.find('.LoginHistory__event').length).toEqual(2);
});
