import React from 'react';
import { useHistory } from 'react-router-dom';

import AppIcon from '@c/app-icon';
import { parseJSON } from '@lib/utils';

import './index.scss';

type Props = {
  appInfo: AppInfo;
  className?: string;
}

function AppInfoView({ appInfo, className = '' }: Props): JSX.Element {
  const history = useHistory();
  const appIcon = parseJSON<AppIconInfo>(appInfo.appIcon, { bgColor: 'amber', iconName: '' });

  return (
    <div
      onClick={() => history.push(`/apps/${appInfo.id}`)}
      className={`${className} flex-1 flex overflow-hidden items-center`}
    >
      <AppIcon
        className='mr-8'
        themeColor={appIcon.bgColor}
        iconName={appIcon.iconName}
        size={44}
      />
      <div className='flex-1 app-info-view-text overflow-hidden'>
        <p className='truncate app-info-view-name text-gray-900'>{appInfo.appName}</p>
        {'useStatus' in appInfo && (
          <p className='app-info-view-status'>{appInfo.useStatus > 0 ? '已发布' : '未发布'}</p>
        )}
      </div>
    </div>
  );
}

export default AppInfoView;
