import React, { createRef } from 'react';
import { useMutation } from 'react-query';
import { Modal, Form, Message } from '@QCFE/lego-ui';

import { Button } from '@portal/components/button';
import SvgIcon from '@portal/components/icon';
import { resetUserPWD } from '@net/corporate-directory';

const { CheckboxGroupField } = Form;

export type CheckedWay = {
  sendPhone: -1 | 1;
  sendEmail: -1 | 1;
};

interface ResetPasswordModalProps {
  userIds: string[];
  closeModal(): void;
  clearSelectRows(): void;
}

export default function ResetPasswordModal(
  { userIds, closeModal, clearSelectRows } : ResetPasswordModalProps) {
  const formRef = createRef<Form>();

  const resetMutation = useMutation(resetUserPWD, {
    onSuccess: (data) => {
      if (data && data.code === 0) {
        Message.success('操作成功！');
      } else {
        Message.error('操作失败！');
      }
      closeModal();
      clearSelectRows();
    },
  });

  const handleReset = () => {
    if (!formRef.current?.validateForm()) {
      return;
    }
    const values: { sendPasswordBy: string[] } = formRef.current?.getFieldsValue();
    const { sendPasswordBy } = values;
    if (sendPasswordBy.length === 0) {
      Message.error('请选择发送方式');
      return;
    }
    const checkedWay: CheckedWay = {
      sendEmail: -1,
      sendPhone: -1,
    };
    if (sendPasswordBy.length > 0) {
      sendPasswordBy.includes('email') && (checkedWay.sendEmail = 1);
      sendPasswordBy.includes('phone') && (checkedWay.sendPhone = 1);
    }
    resetMutation.mutate({ userIDs: userIds, ...checkedWay });
  };

  return (
    <Modal
      visible
      title="重置密码"
      className="static-modal"
      onCancel={closeModal}
      footer={
        <div className="flex items-center">
          <Button
            icon={<SvgIcon name="close" size={20} className="mr-8" />}
            onClick={closeModal}
            className="mr-20"
          >
            取消
          </Button>
          <Button
            className="bg-black-900"
            textClassName="text-white"
            icon={<SvgIcon name="check" type="light" size={20} className="mr-8" />}
            onClick={handleReset}
          >
            发送重置密码
          </Button>
        </div>
      }
    >
      <div className="w-full flex flex-col">
        <div className="w-full box-border-radius px-18 py-12 mb-20 bg-blue-100 flex items-center">
          <SvgIcon name="info" size={24} type="coloured" color="#375FF3" className="mr-10" />
          <span className="text-blue-600">系统将自动生成一个随机密码发送给员工。</span>
        </div>
        <Form layout="vertical" ref={formRef}>
          <CheckboxGroupField
            name="sendPasswordBy"
            label="选择重置密码的发送方式"
            options={[
              {
                label: '通过邮箱',
                value: 'email',
              },
              {
                label: '通过短信',
                value: 'phone',
              },
            ]}
          />
        </Form>
      </div>
    </Modal>
  );
}
