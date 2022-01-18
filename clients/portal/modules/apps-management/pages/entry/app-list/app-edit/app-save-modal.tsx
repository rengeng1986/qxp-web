import React, { useState } from 'react';
import { Input } from 'antd';

import Icon from '@c/icon';
import Modal from '@c/modal';
import toast from '@lib/toast';
import { saveAppAsTemplate } from '../api';

type Props = {
  appInfo: AppInfo | null;
  onCancel: () => void;
}

function SaveAppModal({ appInfo, onCancel }: Props): JSX.Element {
  const [templateName, setAppName] = useState(appInfo?.appName || '');

  function handleSubmit(): void {
    if (templateName.length > 30) {
      toast.error('应用名称不超过30个字符');
      return;
    }

    // before this todo name repeat validate
    saveAppAsTemplate(
      { appID: appInfo?.id ?? '', name: templateName },
      `【${templateName}】 模版保存`,
    ).catch((err) => {
      toast.error('模版保存失败: ', err.message);
    });

    onCancel();
  }

  return (
    <Modal
      title='确定保存为模版'
      onClose={onCancel}
      className="static-modal text-12"
      footerBtns={[
        {
          key: 'close',
          iconName: 'close',
          onClick: onCancel,
          text: '取消',
        },
        {
          key: 'check',
          iconName: 'check',
          modifier: 'primary',
          onClick: handleSubmit,
          text: '确定保存',
        },
      ]}
    >
      <div className="flex-1 p-20">
        <p className="mb-8 bg-gray-50 px-16 py-8 text-blue-600 rounded-12 rounded-tl-4 flex items-center">
          <Icon size={20} className='mr-8 app-icon-color-inherit' name='info' />
          模版不包含应用数据，且保存为模版后，对模版的修改将不回影响此应用
        </p>
        <div className="px-20 py-16 text-12">
          应用名称
          <Input
            className="mt-8 mb-4 rounded-12 rounded-tl-4"
            placeholder='请输入模版应用名称'
            value={templateName}
            onChange={(e) => setAppName(e.target.value)}
          />
          <span>不超过30个字符，应用名称不可重复。</span>
        </div>
      </div>
    </Modal>
  );
}

export default SaveAppModal;
