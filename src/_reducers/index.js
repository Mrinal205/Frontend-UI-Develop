import { combineReducers } from 'redux';

import account from './account.reducer';
import trading from './trading.reducer';
import candlesticks from './candlesticks.reducer';
import exchanges from './exchanges.reducer';
import markets from './markets.reducer';
import marketcap from './marketcap.reducer';
import networth from './networth.reducer';
import orderbook from './orderbook.reducer';
import orders from './orders.reducer';
import selections from './selections.reducer';
import trades from './trades.reducer';
import twoFactorAuth from './twoFactorAuth.reducer';
import user from './user.reducer';
import form from './form.reducer';
import notifications from './notifications.reducer';

import { actionTypes } from '../_actions/user.actions';

const appReducer = combineReducers({
  account,
  trading,
  candlesticks,
  exchanges,
  markets,
  marketcap,
  networth,
  orderbook,
  orders,
  selections,
  trades,
  twoFactorAuth,
  user,
  form,
  notifications
});

// Thanks Dan! https://stackoverflow.com/a/35641992/873073
const rootReducer = (state, action) => {
  if (action.type === actionTypes.LOGOUT_USER_REQUEST) {
    state = undefined;
  }

  return appReducer(state, action);
};

export default rootReducer;
