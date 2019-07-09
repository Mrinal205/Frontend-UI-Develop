import { formatTimestamp } from './dateTime';

describe('DateTime helpers', () => {
  it('format timestamp to hh:mm:ss format', () => {
    const timestamp = 1531343938310;
    expect(formatTimestamp(timestamp)).toEqual('22:18:58');
  });

  it('format epoch timestamp correctly', () => {
    const timestamp = 1531344008.903;
    expect(formatTimestamp(timestamp)).toEqual('22:20:08');
  });
});
