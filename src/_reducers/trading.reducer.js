import reduceReducers from 'reduce-reducers';
import { handleActions } from 'redux-actions';
import { get } from 'lodash';
import { BigNumber } from 'bignumber.js';

import { rpcIds, actionIds } from '_actions/ids';
import { createRPCReducer } from '_helpers/rpc';
import { getFormId, OrderTypes, OfferTypes } from '_constants';
import { safeNumericValue, formatDecimalString } from '_helpers';
import { SELECT_ORDERBOOK_PRICE } from '_actions/orderbook.actions';

const initialState = {
  balance: {},
  forms: {},
  meta: {}
};

BigNumber.config({ ROUNDING_MODE: BigNumber.ROUND_DOWN });

export default reduceReducers(
  (state, action) => state || initialState,

  createRPCReducer(rpcIds.fetchExchangeBalance, {
    request: (state, action) => {
      const { exchange } = action.payload;
      return {
        ...state,
        meta: {
          loadingBalance: {
            ...state.meta.loadingBalance,
            [exchange]: true
          }
        }
      };
    },
    success: (state, action) => {
      const { exchange, resp } = action.payload;
      // we accumulate exchange being loaded in a map
      // when the map is empty it means that there are not loading exchanges anymore
      const loading = state.meta.loadingBalance;
      delete loading[exchange];
      const loadingBalance = Object.keys(loading).length ? { ...loading } : false;

      // filter out "0" balances
      let balance = resp.valuesMap;
      for (let currency in balance) {
        if (balance[currency].available <= 0) {
          delete balance[currency];
        }
      }

      return {
        ...state,
        balance: {
          ...state.balance,
          [exchange]: {
            ...balance
          }
        },
        meta: {
          ...state.meta,
          loadingBalance
        }
      };
    }
  }),

  createRPCReducer(rpcIds.fetchBalance, {
    success: (state, action) => {
      const { exchange, resp } = action.payload;

      // filter out "0" balances
      let balance = resp.valuesMap;
      for (let currency in balance) {
        if (balance[currency].available <= 0) {
          delete balance[currency];
        }
      }

      return {
        ...state,
        balance: {
          ...state.balance,
          [exchange]: {
            ...state.balance[exchange],
            ...balance
          }
        }
      };
    }
  }),

  createRPCReducer(rpcIds.submitOrder, {
    request: (state, action) => {
      const { form } = action.payload;
      return {
        ...state,
        forms: {
          ...state.forms,
          [form]: {
            ...(state.forms[form] || {}),
            orderSubmitting: true,
            orderSucceeded: false,
            orderError: null
          }
        }
      };
    },
    success: (state, action) => {
      const { form } = action.payload;
      return {
        ...state,
        forms: {
          ...state.forms,
          [form]: {
            ...(state.forms[form] || {}),
            orderSubmitting: false,
            orderSucceeded: true,
            // reset values of submitted form
            size: 0,
            sizePercentage: 0,
            total: 0
          }
        }
      };
    },
    failure: (state, action) => {
      const { form, error } = action.payload;
      const errorMessage = get(error, 'response.data.message') || get(error, 'response.data.error');
      return {
        ...state,
        forms: {
          ...state.forms,
          [form]: {
            ...(state.forms[form] || {}),
            orderSubmitting: false,
            orderError: `Error rejected: ${errorMessage}`
          }
        }
      };
    }
  }),

  handleActions(
    {
      [actionIds.initializeOrderValues]: (state, action) => {
        const { form, values } = action.payload;
        return {
          ...state,
          forms: {
            ...state.forms,
            [form]: {
              ...(state.forms[form] || {}),
              ...values,
              orderError: undefined
            }
          }
        };
      },
      [actionIds.rejectOrder]: (state, action) => {
        const { form, error } = action.payload;
        return {
          ...state,
          forms: {
            ...state.forms,
            [form]: {
              ...(state.forms[form] || {}),
              orderError: error
            }
          }
        };
      },
      [actionIds.changeOrderValue]: (state, action) => {
        const { form, precision } = action.payload;
        const formState = FormReducers[form](state, action);

        Object.keys(formState.forms)
          .filter(key => key === form)
          .forEach(k => {
            formState.forms[k] = {
              ...formState.forms[k],
              size: formatDecimalString(precision, String(formState.forms[k].size))
            };
          });

        // reset the other forms
        const otherForms = Object.keys(formState.forms).filter(key => key !== form);
        otherForms.forEach(formKey => {
          formState.forms[formKey] = {
            ...formState.forms[formKey],
            size: 0,
            sizePercentage: 0,
            total: 0,
            orderError: undefined
          };
        });

        return formState;
      },
      [SELECT_ORDERBOOK_PRICE]: (state, action) => {
        const { price, exchangeName } = action.payload;
        const value = safeNumericValue(price);

        let newState = state;
        Object.keys(state.forms).forEach(form => {
          if (FormAssignedFieldReducers[form].price) {
            const priceAction = { payload: { value, field: 'price', form, exchangeName } };
            newState = FormReducers[form](newState, priceAction);
          }
          if (FormAssignedFieldReducers[form].stop) {
            const stopAction = { payload: { value, field: 'stop', form, exchangeName } };
            newState = FormReducers[form](newState, stopAction);
          }
        });

        return newState;
      }
    },
    initialState
  )
);

/* Creates a form reducer based on each form type
 * @param {string} expectedFormType
 * @param {object} fieldReducers
 * @return {function}
 */
function orderFormReducer(fieldReducers) {
  return function reducer(state, action) {
    let { field, value, form, bestMarketPrice, exchangeName } = action.payload;
    const formData = state.forms[form];

    let newState = {
      ...(state.forms[form] || {}),
      [field]: value
    };

    // MARKET orders
    if (typeof bestMarketPrice !== 'undefined') {
      newState.price = bestMarketPrice;
    }

    if (fieldReducers[field]) {
      const available = get(state.balance, [exchangeName, formData.availableCoin, 'available']);
      newState = fieldReducers[field](newState, value, available);
    }

    return {
      ...state,
      forms: {
        ...state.forms,
        [form]: newState
      }
    };
  };
}

/* Reducers used by different forms to accumulate changes
 * They all follow a common pattern:
 * @param {object} result - previous values
 * @param {any} payload - value of this action
 * @return {object} new values
 */
export const FieldReducers = {
  /* -------------- SIZE ----------------------- */
  sellSize: (result, payload, available) => {
    result.sizePercentage = available
      ? (safeNumericValue(payload) * 100) / safeNumericValue(available)
      : null;
    if (result.price) {
      result.total = safeNumericValue(payload) * safeNumericValue(result.price);
    }
    return result;
  },
  buySize: (result, payload, available) => {
    if (result.price) {
      result.total = safeNumericValue(payload) * safeNumericValue(result.price);
      result.sizePercentage = available
        ? (safeNumericValue(result.total) * 100) / safeNumericValue(available)
        : null;
    }
    return result;
  },
  stopSellSize: (result, payload, available) => {
    result.sizePercentage = available
      ? (safeNumericValue(payload) * 100) / safeNumericValue(available)
      : null;
    if (result.stop) {
      result.total = safeNumericValue(payload) * safeNumericValue(result.stop);
    }
    return result;
  },
  stopBuySize: (result, payload, available) => {
    if (result.stop) {
      result.total = safeNumericValue(payload) * safeNumericValue(result.stop);
      result.sizePercentage = available
        ? (safeNumericValue(result.total) * 100) / safeNumericValue(available)
        : null;
    }
    return result;
  },
  signalBuySize: (result, payload, available) => {
    result.total = safeNumericValue(payload);
    result.sizePercentage = available
      ? (safeNumericValue(result.total) * 100) / safeNumericValue(available)
      : null;
    return result;
  },

  /* -------------- PRICE ----------------------- */
  buyPrice: (result, payload, available) => {
    if (result.size) {
      result.total = safeNumericValue(result.size) * safeNumericValue(payload);
      result.sizePercentage = safeNumericValue(available)
        ? (safeNumericValue(result.total) * 100) / safeNumericValue(available)
        : null;
    }
    return result;
  },
  sellPrice: (result, payload, available) => {
    if (result.size) {
      result.total = safeNumericValue(result.size) * safeNumericValue(payload);
      result.sizePercentage = safeNumericValue(available)
        ? (safeNumericValue(result.size) * 100) / safeNumericValue(available)
        : null;
    }
    return result;
  },

  /* -------------- PERCENTAGE SIZE ----------------------- */
  sizePercentage: (result, payload, available) => {
    if (available) {
      result.size = (safeNumericValue(available) * safeNumericValue(payload)) / 100;
      if (result.price) {
        result.total = safeNumericValue(result.size) * safeNumericValue(result.price);
      }
    }
    return result;
  },
  buysizePercentage: (result, payload, available) => {
    if (available) {
      const bnAvailable = BigNumber(available);
      const total = bnAvailable.multipliedBy(payload).dividedBy(100);
      result.total = total.toNumber();
      result.size = total.dividedBy(result.price).toFixed(8);
    }
    return result;
  },
  stopSellSizePercentage: (result, payload, available) => {
    if (available) {
      result.size = (safeNumericValue(available) * safeNumericValue(payload)) / 100;
      if (result.stop) {
        result.total = safeNumericValue(result.size) * safeNumericValue(result.stop);
      }
    }
    return result;
  },
  stopBuySizePercentage: (result, payload, available) => {
    if (available) {
      result.total = (safeNumericValue(available) * safeNumericValue(payload)) / 100;
      result.size = safeNumericValue(result.total) / safeNumericValue(result.stop);
    }
    return result;
  },
  signalBuysizePercentage: (result, payload, available) => {
    if (available) {
      result.total = (safeNumericValue(available) * safeNumericValue(payload)) / 100;
      result.size = safeNumericValue(result.total);
    }
    return result;
  },
  convertCoinsizePercentage: (result, payload, available) => {
    if (available) {
      result.size = (safeNumericValue(available) * safeNumericValue(payload)) / 100;
    }
    if (result.price && result.size) {
      result.total =
        (safeNumericValue(result.size) * safeNumericValue(result.basePrice)) /
        safeNumericValue(result.price);
    }
    return result;
  },

  /* --------------- TOTAL -------------------------------- */
  buyTotal: (result, payload, available) => {
    if (result.price) {
      result.sizePercentage = available
        ? (safeNumericValue(payload) * 100) / safeNumericValue(available)
        : 0;
      result.size = safeNumericValue(payload) / safeNumericValue(result.price);
    }
    return result;
  },
  sellTotal: (result, payload, available) => {
    if (result.price) {
      result.size = safeNumericValue(payload) / safeNumericValue(result.price);
      result.sizePercentage = available
        ? (safeNumericValue(result.size) * 100) / safeNumericValue(available)
        : null;
    }
    return result;
  },
  convertCoinTotal: (result, payload, available) => {
    if (result.price) {
      result.size =
        (safeNumericValue(result.total) * safeNumericValue(result.price)) /
        safeNumericValue(result.basePrice);
    }
    result.sizePercentage = available
      ? (safeNumericValue(result.size) * 100) / safeNumericValue(available)
      : null;
    return result;
  },

  /* --------------- CONVERT COIN -------------------------------- */
  convertCoinCoin: (result, payload, available) => {
    result.coin = payload.value;
    result.price = safeNumericValue(payload.price);
    result.basePrice = safeNumericValue(payload.basePrice);
    if (result.size === 0) {
      result.total = 0;
    } else if (result.size) {
      result.total =
        (safeNumericValue(result.size) * safeNumericValue(result.basePrice)) /
        safeNumericValue(result.price);
    }
    return result;
  }
};

const FormAssignedFieldReducers = {
  [getFormId(OfferTypes.BUY, OrderTypes.LIMIT)]: {
    size: FieldReducers.buySize,
    sizePercentage: FieldReducers.buysizePercentage,
    price: FieldReducers.buyPrice,
    total: FieldReducers.buyTotal
  },

  [getFormId(OfferTypes.SELL, OrderTypes.LIMIT)]: {
    size: FieldReducers.sellSize,
    sizePercentage: FieldReducers.sizePercentage,
    price: FieldReducers.sellPrice,
    total: FieldReducers.sellTotal
  },

  [getFormId(OfferTypes.BUY, OrderTypes.MARKET)]: {
    size: FieldReducers.buySize,
    sizePercentage: FieldReducers.buysizePercentage,
    total: FieldReducers.buyTotal
  },

  [getFormId(OfferTypes.SELL, OrderTypes.MARKET)]: {
    size: FieldReducers.sellSize,
    sizePercentage: FieldReducers.sizePercentage,
    total: FieldReducers.sellTotal
  },

  [getFormId(OfferTypes.BUY, OrderTypes.STOP)]: {
    size: FieldReducers.stopBuySize,
    sizePercentage: FieldReducers.stopBuySizePercentage,
    stop: FieldReducers.buyPrice,
    total: FieldReducers.buyTotal
  },

  [getFormId(OfferTypes.SELL, OrderTypes.STOP)]: {
    size: FieldReducers.stopSellSize,
    sizePercentage: FieldReducers.stopSellSizePercentage,
    stop: FieldReducers.sellPrice,
    total: FieldReducers.sellTotal
  },

  [getFormId(OfferTypes.BUY, OrderTypes.SIGNAL)]: {
    size: FieldReducers.buySize,
    sizePercentage: FieldReducers.buysizePercentage,
    total: FieldReducers.buyTotal
  },

  [getFormId(OfferTypes.SELL, OrderTypes.SIGNAL)]: {
    size: FieldReducers.sellSize,
    sizePercentage: FieldReducers.sizePercentage,
    total: FieldReducers.sellTotal
  },

  [getFormId(OfferTypes.CONVERT, OrderTypes.CONVERT)]: {
    sizePercentage: FieldReducers.convertCoinsizePercentage,
    size: FieldReducers.sellSize,
    coin: FieldReducers.convertCoinCoin,
    total: FieldReducers.convertCoinTotal
  }
};

const FormReducers = Object.keys(FormAssignedFieldReducers).reduce((prev, form) => {
  prev[form] = orderFormReducer(FormAssignedFieldReducers[form]);
  return prev;
}, {});
