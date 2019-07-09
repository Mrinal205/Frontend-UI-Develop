import React from 'react';
import { connect } from 'react-redux';

import QRCode from 'qrcode.react';

import TwoFactorAuthForm from '../TwoFactorAuthForm/TwoFactorAuthForm';

import { Button } from 'components/Button';
import { Hint } from 'components/Hint';
import Spinner from 'components/Spinner';

import { create2fa, confirm2fa, disable2fa, reset2fa } from '_actions/twoFactorAuth.actions';

import './TwoFactorAuth.scss';

export class TwoFactorAuth extends React.Component {
  constructor(props) {
    super(props);
    this.handleEnable2faClick = this.handleEnable2faClick.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleDisableSubmit = this.handleDisableSubmit.bind(this);
  }

  componentWillUnmount() {
    this.props.dispatch(reset2fa());
  }

  handleEnable2faClick(event) {
    event.preventDefault();
    const { user } = this.props;
    this.props.dispatch(create2fa(user.userId));
  }

  handleSubmit(values) {
    const { user } = this.props;
    this.props.dispatch(confirm2fa(values.number, user.userId));
  }

  handleDisableSubmit(values) {
    const { user } = this.props;
    this.props.dispatch(disable2fa(values.number, user.userId));
  }

  renderSetup() {
    const { twoFactorAuth } = this.props;
    const initial = !(twoFactorAuth.meta.creating || twoFactorAuth.uri);

    return (
      <div>
        {twoFactorAuth.meta.creating && <Spinner size="big" color="blue" />}
        {twoFactorAuth.uri && this.renderForm()}
        {initial && (
          <React.Fragment>
            <p>Enable Two-factor authentication to increase security of your account.</p>
            <Button onClick={this.handleEnable2faClick}>Enable 2FA</Button>
            {twoFactorAuth.meta.disabled && (
              <Hint type="success">Your 2FA authentication was deactivated!</Hint>
            )}
          </React.Fragment>
        )}
      </div>
    );
  }

  renderForm() {
    const { twoFactorAuth } = this.props;
    return (
      <div className="TwoFactorAuth__steps">
        <div className="TwoFactorAuth__step">
          <p>1. Scan the following QR code into your Google Authenticator App</p>
          <div className="TwoFactorAuth__code">
            <div className="TwoFactorAuth__code-box">
              <QRCode value={twoFactorAuth.uri} size={128} />
            </div>
          </div>
        </div>
        <div className="TwoFactorAuth__step">
          <p>2. Enter the code below and click confirm.</p>
          <TwoFactorAuthForm twoFactorAuth={twoFactorAuth} onSubmit={this.handleSubmit} />
        </div>
      </div>
    );
  }

  renderEnabled() {
    const { twoFactorAuth } = this.props;
    return (
      <React.Fragment>
        <Hint type="special">
          Two-factor authentication (2FA) is <strong>enabled</strong> on this account.
        </Hint>

        <br />
        <p>To disable 2FA authentication enter your 2FA code below and click disable.</p>

        <TwoFactorAuthForm
          disable={true}
          twoFactorAuth={twoFactorAuth}
          onSubmit={this.handleDisableSubmit}
        />
      </React.Fragment>
    );
  }

  render() {
    const { account, twoFactorAuth } = this.props;
    const is2FaEnabled = account.twoFactorEnabled || twoFactorAuth.meta.confirmed;
    return (
      <div className="TwoFactorAuth">
        {is2FaEnabled ? this.renderEnabled() : this.renderSetup()}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  twoFactorAuth: state.twoFactorAuth
});

export default connect(mapStateToProps)(TwoFactorAuth);
