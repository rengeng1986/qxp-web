import React from 'react';
import { Switch, Route } from 'react-router-dom';

import SideNavCard from '@c/side-nav-card';
import ItemWithTitleDesc from '@c/item-with-title-desc';
import BgIcon from '@appC/bg-icon';

import MyApp from './my-app';

import './index.scss';

const MENU = [
  {
    id: 'MyApp',
    icon: 'dashboard_customize',
    name: '我的应用',
    url: '/apps/list',
  },
  // {
  //   id: 'PlatformSetting',
  //   icon: 'theme',
  //   name: '平台设置',
  // },
];

function AppManagerEntry() {
  return (
    <div className="max-w-screen app-entry-container">
      <SideNavCard cardTitle={(
        <div className="access-background-image p-20 opacity-90">
          <ItemWithTitleDesc
            title="应用管理"
            desc="对企业的自建应用进行统一管理"
            itemRender={(
              <BgIcon themeColor='amber' iconName='dashboard_customize' size={48} />
            )}
            titleClassName="text-2 leading-8 font-bold mb-2"
            descClassName="leading-8"
          />
        </div>
      )} menuData={MENU} />
      <div className="app-right-box bg-opacity-50 bg-white">
        <Switch>
          <Route exact path="/apps/list" component={MyApp} />
        </Switch>
      </div>
    </div>
  );
}

export default AppManagerEntry;
