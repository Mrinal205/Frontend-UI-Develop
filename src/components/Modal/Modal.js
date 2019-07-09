import React, { Component } from 'react';
import ReactModal from 'react-modal';

import { Button } from 'components/Button';

import './Modal.scss';

export default class Modal extends Component {
  render() {
    const { children, headline, actions, ...restProps } = this.props;
    const modalProps = {
      ...restProps,
      appElement: document.getElementById('#moon-assist-root'),
      ariaHideApp: false,
      overlayClassName: 'ModalOverlay'
    };
    return (
      <ReactModal className="ModalWindow" {...modalProps}>
        {headline && <h2 className="ModalWindow__headline">{headline}</h2>}
        <div className="ModalWindow__content">{children}</div>
        {actions && (
          <div className="ModalWindow__actions">
            {actions.confirm && (
              <Button onClick={actions.confirm.onConfirm}>{actions.confirm.label}</Button>
            )}
          </div>
        )}
        <span className="ModalWindow__close" onClick={modalProps.onRequestClose} />
      </ReactModal>
    );
  }
}
