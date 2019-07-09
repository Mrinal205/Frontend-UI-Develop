import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

const PrivateRoute = ({ component: Component, user, ...rest }) => {
  const isAuthenticated = user && user.accountId;
  return (
    <Route
      {...rest}
      render={props =>
        isAuthenticated ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: '/auth/login',
              state: {
                from: props.location
              }
            }}
          />
        )
      }
    />
  );
};

// fetch user from redux state
const mapStateToProps = state => ({ user: state.user });

// connect component to redux store
export default connect(mapStateToProps)(PrivateRoute);
