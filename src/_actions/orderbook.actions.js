import { getOrderBook } from '_api';

export const FETCH_ORDERBOOK_REQUEST = '@moon/FETCH_ORDERBOOK_REQUEST';
export const FETCH_ORDERBOOK_SUCCESS = '@moon/FETCH_ORDERBOOK_SUCCESS';
export const FETCH_ORDERBOOK_ERROR = '@moon/FETCH_ORDERBOOK_ERROR';

export const SELECT_ORDERBOOK_PAGE = '@moon/SELECT_ORDERBOOK_PAGE';
export const SELECT_ORDERBOOK_PRICE = '@moon/SELECT_ORDERBOOK_PRICE';
export const SELECT_ORDERBOOK_PRECISION = '@moon/SELECT_ORDERBOOK_PRECISION';

export function fetchOrderBookRequest() {
  return {
    type: FETCH_ORDERBOOK_REQUEST
  };
}

export function fetchOrderBookSuccess(orderbook) {
  return {
    type: FETCH_ORDERBOOK_SUCCESS,
    payload: {
      orderbook
    }
  };
}

export function fetchOrderBookError(error) {
  return {
    type: FETCH_ORDERBOOK_ERROR,
    payload: {
      error
    }
  };
}

export function fetchOrderBook(exchange, market) {
  return dispatch => {
    dispatch(fetchOrderBookRequest());
    return getOrderBook(exchange, market).then(
      data => {
        dispatch(fetchOrderBookSuccess(data.orders));
      },
      error => dispatch(fetchOrderBookError(error))
    );
  };
}

export const selectOrderbookPage = (area, page) => ({
  type: SELECT_ORDERBOOK_PAGE,
  payload: {
    area,
    page
  }
});

export const selectOrderbookPrice = (price, exchangeName) => ({
  type: SELECT_ORDERBOOK_PRICE,
  payload: { price, exchangeName },
  meta: {
    field: 'price'
  }
});

export const selectOrderbookPrecision = precision => ({
  type: SELECT_ORDERBOOK_PRECISION,
  payload: { precision }
});
