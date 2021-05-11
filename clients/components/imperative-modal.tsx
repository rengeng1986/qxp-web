import React from 'react';
import Modal from '@c/modal2';
import ReactDOM from 'react-dom';

interface Params {
  title: string;
  content: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  confirmModifier?: 'primary' | 'danger';
  cancelModifier?: 'primary' | 'danger';
  onConfirm: () => void;
  onCancel?: () => void;
}

export default function creatModal({
  title,
  content,
  confirmText = '确定',
  cancelText = '取消',
  confirmModifier = 'primary',
  cancelModifier,
  onConfirm,
  onCancel,
}: Params) {
  const modalDom = document.createElement('div');

  const close = () => {
    ReactDOM.unmountComponentAtNode(modalDom);
    modalDom.remove();
  };
  const show = () => {
    ReactDOM.render((
      <Modal
        title={title}
        footerBtnSchema={[
          {
            text: cancelText,
            key: 'cancel',
            onClick: () => {
              close();
              onCancel && onCancel();
            },
            modifier: cancelModifier,
          },
          {
            text: confirmText,
            key: 'confirm',
            onClick: onConfirm,
            modifier: confirmModifier,
          },
        ]}
      >
        {content}
      </Modal>
    ), modalDom);
  };
  return {
    show,
    close,
  };
}
