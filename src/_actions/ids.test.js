import { mirror, camelUpper, createActionNames, mirrorDecamelized } from './ids';

describe('mirror function', () => {
  it('should mirror arrays values into key-value object', () => {
    expect(mirror(['test'])).toEqual({ test: 'test' });
  });
});

describe('mirror decamelized function', () => {
  it('should mirror arrays values into key-value object with a format', () => {
    expect(mirrorDecamelized(['testLoop'])).toEqual({ testLoop: '@moon/TEST_LOOP' });
  });
});

describe('camelUpper utility', () => {
  it('should decamelize a string', () => {
    expect(camelUpper('testAction')).toEqual('TEST_ACTION');
  });
});

describe('createActionNames', () => {
  it('should create action names for each rpcId in an object', () => {
    expect(createActionNames({ test: 'test' })).toEqual({
      test: {
        request: '@moon-rpc/TEST_REQUEST',
        success: '@moon-rpc/TEST_SUCCESS',
        failure: '@moon-rpc/TEST_FAILURE',
        start: '@moon-rpc/TEST_START',
        stop: '@moon-rpc/TEST_STOP'
      }
    });
  });
});
