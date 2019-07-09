import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { hotjar } from 'react-hotjar';

import PublicArea from 'components/Areas/PublicArea/PublicArea';
import ProtectedArea from 'components/Areas/ProtectedArea/ProtectedArea';
import PrivateRoute from 'components/PrivateRoute/PrivateRoute';
import CookieConstent from 'components/CookieConsent/CookieConstent';

import { restoreUser } from '_actions/user.actions';

import { HOTJAR_ID, HOTJAR_VERSION } from '_constants/';

import './css/styles.scss';

export class Application extends Component {
  static propTypes = {
    restoreUser: PropTypes.func.isRequired
  };

  componentWillMount() {
    this.props.restoreUser();
  }

  componentDidMount() {
    if (HOTJAR_ID) {
      hotjar.initialize(HOTJAR_ID, HOTJAR_VERSION);
    }
  }

  render() {
    return (
      <React.Fragment>
        <Router>
          <Switch>
            <Route path="/auth" component={PublicArea} />
            <PrivateRoute path="/" component={ProtectedArea} />
          </Switch>
        </Router>
        <CookieConstent />
      </React.Fragment>
    );
  }
}

const mapDispatchToProps = {
  restoreUser
};

export default connect(
  undefined,
  mapDispatchToProps
)(Application);
