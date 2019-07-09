import { default as formReducer, FieldReducers } from './form.reducer';
import { actionTypes } from '_actions/user.actions';
import { actionNames, rpcIds, actionIds } from '_actions/ids';
import { SELECT_ORDERBOOK_PRICE } from '_actions/orderbook.actions';
import { OrderTypesReadable } from '_constants';
import {
  MarketFormTypes,
  getFormId,
  OrderTypes,
  StopLimitSteps,
  TrailingStopSteps,
  NonNumericOrderFields
} from '_constants';

describe('form reducer plugin', () => {
  it('returns correct state for USER_EDIT_PASSWORD_SUCCESS action', () => {
    const initialState = {
      passwordChangeForm: {
        oldPassword: 'test'
      },
      someOtherForm: {
        value: 'some value'
      }
    };
    const action = {
      type: actionTypes.USER_EDIT_PASSWORD_SUCCESS
    };

    const expectedState = {
      ...initialState,
      passwordChangeForm: undefined
    };
    expect(formReducer(initialState, action)).toEqual(expectedState);
  });

  it('returns correct state for all other actions', () => {
    const initialState = {
      passwordChangeForm: {
        oldPassword: 'test'
      },
      someOtherForm: {
        value: 'some value'
      }
    };
    const action = {
      type: 'DUMMY_ACTION'
    };

    const expectedState = {
      ...initialState
    };

    expect(formReducer(initialState, action)).toEqual(expectedState);
  });
});
