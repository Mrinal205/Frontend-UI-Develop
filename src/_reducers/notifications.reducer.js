import reduceReducers from 'reduce-reducers';
import { handleActions } from 'redux-actions';

import { actionIds } from '_actions/ids';

const initialState = {
  list: {}
};

export default reduceReducers(
  (state, action) => state || initialState,

  handleActions(
    {
      [actionIds.createNotification]: (state, action) => {
        const { id, duration, notification } = action.payload;
        return {
          ...state,
          list: {
            ...state.list,
            [action.payload.id]: {
              duration,
              id,
              notification
            }
          }
        };
      },
      [actionIds.removeNotification]: (state, action) => {
        const { id } = action.payload;
        const list = { ...state.list };
        delete list[id];
        return {
          ...state,
          list
        };
      }
    },
    initialState
  )
);
