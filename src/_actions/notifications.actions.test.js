import { actionIds } from '_actions/ids';
import { removeNotification, createNotification } from './notifications.actions';

describe('notifications actions', () => {
  it('remove notification must return action', () => {
    const actual = removeNotification('test_id');
    const expected = {
      type: actionIds.removeNotification,
      payload: {
        id: 'test_id'
      }
    };
    expect(actual).toEqual(expected);
  });

  const dispatch = jest.fn();
  createNotification({ id: 'test_id', duration: 1 })(dispatch);

  it('create notification dispatches one action immediately', () => {
    expect(dispatch.mock.calls.length).toEqual(1);
  });

  setTimeout(() => {
    it('create notification dispatches second action after duration', () => {
      expect(dispatch.mock.calls.length).toEqual(2);
    });
  }, 2);
});
