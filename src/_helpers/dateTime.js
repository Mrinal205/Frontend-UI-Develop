import moment from 'moment';

/**
 * Formats timestamp as time string
 * @param {*} timestamp
 * @param {*} options
 */
export function formatTimestamp(timestamp) {
  // workaround to make timestamp compatible with JS Date object
  // as some exchange may return timestamp in epoch format (without ms)
  const dateTime = timestamp.toFixed(0).length <= 10 ? moment.unix(timestamp) : moment(timestamp);
  return dateTime.format('HH:mm:ss');
}
