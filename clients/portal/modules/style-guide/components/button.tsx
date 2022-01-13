import React from 'react';
import cs from 'classnames';

import Icon from '@c/icon';

import './index.css';

interface Props extends React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> {
  modifier?: 'primary' | 'danger';
  loading?: boolean;
  forbidden?: boolean;
  iconName?: string;
}

function ButtonPreview(
  props: Props,
): JSX.Element {
  const {
    iconName,
    modifier,
    forbidden,
    loading,
  } = props;
  return (
    <button
      className={cs('qxp-btn', {
        [`qxp-btn--${modifier}`]: modifier,
        'qxp-btn--forbidden opacity-50': forbidden,
        'qxp-btn--loading': loading,
        'pointer-events-none': loading || forbidden,
      })}
      disabled={forbidden}
    >
      {(iconName || loading) && (
        <Icon
          name='refresh'
          type={modifier === 'primary' ? 'light' : 'dark'}
          size={20}
          className={cs('fill-current text-inherit mr-4', {
            'animate-spin': loading,
            'pointer-events-none': loading || forbidden,
          })}
        />
      )}
      <span>Preview</span>
    </button>
  );
}

const schemas: ComponentStyleStatus[] = [
  {
    key: 'default',
    configSchema: [
      {
        selector: '.qxp-btn',
        desc: '可编辑属性有宽度、边框、圆角等',
        pseudo: [
          {
            selector: 'active',
            desc: '按钮点击效果',
          },
          {
            selector: 'hover',
            desc: '按钮鼠标移入效果',
          },
        ],
      },
    ],
  },
  {
    key: 'forbidden',
    property: 'forbidden',
    value: true,
    configSchema: [
      {
        selector: '.qxp-btn--forbidden',
        desc: '禁止',
      },
    ],
  },
  {
    key: 'loading',
    property: 'loading',
    value: true,
    configSchema: [
      {
        selector: '.qxp-btn--loading',
        desc: 'loading',
      },
    ],
  },
  {
    key: 'primary',
    property: 'modifier',
    value: 'primary',
    configSchema: [
      {
        selector: '.qxp-btn--primary',
        desc: '默认样式',
      },
    ],
  },
  {
    key: 'danger',
    property: 'modifier',
    value: 'danger',
    configSchema: [
      {
        selector: '.qxp-btn--danger',
        desc: 'loading',
      },
    ],
  },
];

export default {
  key: 'button',
  schemas,
  Component: ButtonPreview,
};

