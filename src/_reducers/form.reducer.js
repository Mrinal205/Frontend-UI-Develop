import { reducer as formReducer } from 'redux-form';
import reduceReducers from 'reduce-reducers';

import { actionTypes } from '_actions/user.actions';

/* ------------------ Exported Reducer ------------------ */
export default reduceReducers(
  (state, action) => state || {},

  formReducer.plugin({
    // Cleaning form state in some specific cases
    // See https://redux-form.com/7.2.3/docs/faq/howtoclear.md/
    passwordChangeForm: (state, action) => {
      switch (action.type) {
        case actionTypes.USER_EDIT_PASSWORD_SUCCESS:
          return undefined;
        default:
          return state;
      }
    }
  })
);
