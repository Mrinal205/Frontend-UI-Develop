import { actionIds } from '_actions/ids';
import { createAction } from 'redux-actions';

export const removeNotification = id => createAction(actionIds.removeNotification)({ id });

export const createNotification = (notification, duration = 6000) => dispatch => {
  const id = new Date().getTime();
  dispatch(createAction(actionIds.createNotification)({ notification, duration, id }));

  setTimeout(() => {
    dispatch(removeNotification(id));
  }, duration);
};
