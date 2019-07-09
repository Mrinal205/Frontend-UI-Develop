import React from 'react';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';

import Form from './form';

import { userEditPassword, userEditPasswordReset } from '_actions/user.actions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretLeft } from '@fortawesome/free-solid-svg-icons';

export class Password extends React.Component {
  onSubmit(data) {
    const { user } = this.props;
    return this.props.dispatch(userEditPassword(user, data));
  }

  componentWillUnmount() {
    this.props.dispatch(userEditPasswordReset());
  }

  render() {
    const { user, cancelTo } = this.props;
    const title = 'Change Password';
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
            <Form onSubmit={data => this.onSubmit(data)} meta={user.meta} />
            <div className="form__row form__row--short">
              <Link to={cancelTo}>
                <button className="button button--short button--faint">
                  <FontAwesomeIcon icon={faCaretLeft} size="lg" /> Back
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapsStateToProps = state => ({
  cancelTo: '/account/settings',
  user: state.user
});

export default connect(mapsStateToProps)(Password);
