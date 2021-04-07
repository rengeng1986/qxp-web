import React from 'react';

import Icon from '@c/icon';

import './index.scss';

type Props = {
  bgColor: BgColor;
  onClick?: (bgColor: BgColor) => void;
  iconName?: string;
  size?: number;
  iconSize?: number;
  className?: string;
}

function BgIcon({ size = 44, iconSize = 28, className = '', iconName, bgColor, onClick }: Props) {
  return (
    <div
      onClick={() => onClick?.(bgColor)}
      style={{ '--appBgIconSize': size + 'px' } as React.CSSProperties}
      className={`icon-border-radius bg-gradient-${bgColor} ${className} app-bg-icon`}>
      {iconName ? (<Icon type='light' name={iconName} size={iconSize} />) : null}
    </div>
  );
}

export default BgIcon;
