import reducer from './notifications.reducer';
import { actionIds } from '../_actions/ids';

describe('balance reducer', () => {
  const initialState = { list: {} };

  it('returns initial state', () => {
    expect(reducer(undefined, {})).toEqual(initialState);
  });

  it('ignores dummy action type', () => {
    expect(reducer(initialState, { type: '@moon/DUMMY_ACTION' })).toEqual(initialState);
  });

  it('adds notification to list', () => {
    const action = {
      type: actionIds.createNotification,
      payload: {
        duration: 3,
        id: 4,
        notification: { type: 'order' }
      }
    };

    const expectedState = {
      list: {
        4: {
          duration: 3,
          id: 4,
          notification: { type: 'order' }
        }
      }
    };

    expect(reducer(initialState, action)).toEqual(expectedState);
  });

  it('removes notification from list', () => {
    const state = {
      list: {
        4: {
          duration: 3,
          id: 4,
          notification: { type: 'order' }
        }
      }
    };
    const action = {
      type: actionIds.removeNotification,
      payload: {
        id: 4
      }
    };
    const expectedState = { list: {} };
    expect(reducer(state, action)).toEqual(expectedState);
  });
});
