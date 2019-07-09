import { connect } from 'react-redux';

import {
  submitOrder,
  initializeOrderValues,
  changeOrderValue,
  rejectOrder
} from '_actions/orders.actions';
import AdvancedMarketForm from './AdvancedMarketForm';

const mapStateToProps = (state, ownProps) => {
  const { selectedMarket, selectedExchange, selectedMarketLimits } = ownProps;
  const {
    trading: { balance, forms },
    markets
  } = state;

  return {
    account: state.account,
    selectedMarket,
    selectedExchange,
    selectedMarketLimits,
    balance,
    orderbook: state.orderbook,
    forms,
    markets: markets[selectedExchange.exchangeName].list
  };
};

const mapDispatchToProps = {
  submitOrder,
  initializeOrderValues,
  changeOrderValue,
  rejectOrder
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AdvancedMarketForm);
