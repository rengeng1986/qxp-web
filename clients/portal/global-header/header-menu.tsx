import React, { useState } from 'react';
import { Icon } from '@QCFE/lego-ui';

import More from '@c/more';
import SvgIcon from '@c/icon';
import { uuid } from '@lib/utils';

import ResetPasswordModal from './reset-password-modal';

export default function HeaderMenu() {
  const [openResetPasswordModal, setOpenResetPasswordModal] = useState<boolean>(false);

  return (
    <div className="flex justify-end items-center flex-2">
      <ResetPasswordModal
        visible={openResetPasswordModal}
        onCancel={() => setOpenResetPasswordModal(false)}
      />
      <div className="mr-56 header-nav-btn group">
        <div className="header-nav-btn-icon-wrapper">
          <SvgIcon
            name="book"
            className="group-hover:text-blue-600 header-nav-btn-icon"
            size={24}
          />
        </div>
        <span className="header-nav-btn-text group-hover:text-blue-600">
              帮助文档
        </span>
      </div>
      <div className="header-nav-btn group">
        <SvgIcon
          name="settings"
          className="group-hover:text-blue-600 header-nav-btn-icon"
          size={24}
        />
        <More
          items={[
            <span
              onClick={() => setOpenResetPasswordModal(true)}
              key={uuid()}
              className="cursor-pointer flex items-center h-36
              pl-16 hover:bg-blue-100 transition whitespace-nowrap text-button
              text-gray-900 hover:text-gray-600"
            >
              重置密码
            </span>,
            <form
              key={uuid()}
              action="/logout"
              method="post"
              className="w-full h-full"
            >
              <button
                type="submit"
                className="cursor-pointer flex items-center h-36 px-16
                hover:bg-blue-100 transition w-full whitespace-nowrap text-button
                text-gray-900 hover:text-gray-600"
              >
                登出
              </button>
            </form>,
          ]}
          className="flex items-center justify-center"
          contentClassName="w-48"
        >
          <div
            className="cursor-pointer flex items-center h-36
            hover:blue-100 transition group-hover:text-blue-600"
          >
            个人中心
            <Icon name="caret-down" style={{ marginLeft: '8px' }} />
          </div>
        </More>
      </div>
    </div>
  );
}
