import React from 'react';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';

import { Switch, Route, withRouter } from 'react-router-dom';

import { getConnectedExchanges, getAvailableExchanges } from '_selectors/exchanges';
import { connectExchange, disconnectExchange, resetExchangeForm } from '_actions/exchanges.actions';

import AddExchangeForm from './AddExchangeForm/AddExchangeForm';
import ConnectedExchanges from './ConnectedExchanges/ConnectedExchanges';

export class Exchanges extends React.Component {
  handleDisconnect = exchange => {
    const { account, disconnectExchange } = this.props;
    disconnectExchange(exchange, account.id);
  };

  handleSubmit = values => {
    const { account, connectExchange, history } = this.props;
    connectExchange(values, account.id, () => {
      history.replace('/account/exchanges');
    });
  };

  render() {
    const title = 'Exchanges';

    return (
      <div className="content">
        <Helmet>
          <title>{title} - Moon Assist</title>
        </Helmet>

        <div className="content__header">
          <h1 className="content__title">{title}</h1>
        </div>

        <div className="content__body">
          <div className="content__section">
            <Switch>
              <Route
                path="/account/exchanges/add"
                render={props => (
                  <AddExchangeForm
                    {...props}
                    account={this.props.account}
                    onSubmit={this.handleSubmit}
                    availableExchanges={this.props.availableExchanges}
                    resetExchangeForm={this.props.resetExchangeForm}
                  />
                )}
              />
              <Route
                path="/account/exchanges"
                render={props => (
                  <ConnectedExchanges
                    {...props}
                    exchanges={this.props.exchanges}
                    availableExchanges={this.props.availableExchanges}
                    onDisconnect={this.handleDisconnect}
                  />
                )}
              />
            </Switch>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  account: state.account,
  user: state.user,
  exchanges: getConnectedExchanges(state),
  availableExchanges: getAvailableExchanges(state)
});

const mapDispatchToProps = {
  disconnectExchange,
  connectExchange,
  resetExchangeForm
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Exchanges)
);
