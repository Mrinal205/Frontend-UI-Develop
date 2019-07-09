jest.mock('axios', () => {
  return {
    CancelToken: {
      source: jest.fn().mockReturnValue({ cancel: jest.fn() })
    }
  };
});

import { uniqueRequestById } from './axios-xhr';
import { CancelToken } from 'axios';

describe('uniqueRequestById helper', () => {
  it('it only runs cancel the second time but fn is called twice', () => {
    const fn = jest.fn();
    const mockCancel = CancelToken.source().cancel;

    uniqueRequestById('test', fn);
    expect(mockCancel).toHaveBeenCalledTimes(0);
    expect(fn).toHaveBeenCalledTimes(1);

    uniqueRequestById('test', fn);
    expect(mockCancel).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledTimes(2);
  });
});
