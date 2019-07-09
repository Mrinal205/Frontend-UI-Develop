import React, { Component } from 'react';
import { Link, Route } from 'react-router-dom';
import { withRouter } from 'react-router';

import LoginPageContainer from 'Pages/Auth/Login/LoginPageContainer/LoginPageContainer';
import RegisterPageContainer from 'Pages/Auth/Register/RegisterPageContainer/RegisterPageContainer';
import VerificationPage from 'Pages/Auth/Verification/VerificationPage';
import { Email as ResetPasswordInput, Password as ResetPassword } from 'Pages/Auth/password';

import { AppFooter } from 'components/AppFooter';
import { trackPageView } from '_vendors/analytics';

import './PublicArea.scss';
import logo from 'assets/logo.svg';

const CloseLink = ({ redirectTo }) => (
  <a href={redirectTo} className="PublicArea__close" aria-label="Close">
    <span className="sr-only">Close and return to homepage</span>
  </a>
);

export class PublicArea extends Component {
  componentDidMount() {
    this.trackPageView(this.props.location.pathname);
  }

  componentDidUpdate(prevProps) {
    const { location } = this.props;
    if (location.pathname !== prevProps.location.pathname) {
      this.trackPageView(location.pathname);
    }
  }

  trackPageView(pathname) {
    // do not track market redirect
    if (pathname === '/') {
      return;
    }

    trackPageView(pathname);
  }

  render() {
    return (
      <div className="PublicArea">
        <div className="PublicArea__inner">
          <div className="PublicArea__col">
            <div className="PublicArea__logo">
              <Link to="/">
                <img src={logo} alt="Moon Assist" />
              </Link>
            </div>

            <div className="PublicArea__content">
              <Route path="/auth/login" component={LoginPageContainer} />
              <Route path="/auth/register" component={RegisterPageContainer} />
              <Route path="/auth/forgot/" component={ResetPasswordInput} />
              <Route path="/auth/verify/" component={VerificationPage} />
              <Route path="/auth/forgotpassword" component={ResetPassword} />
            </div>

            <div className="PublicArea__footer">
              <AppFooter extended={false} />
            </div>
          </div>
          <CloseLink redirectTo="https://www.moonassist.com/" />
        </div>
      </div>
    );
  }
}

export default withRouter(PublicArea);
