import React from 'react';
import { observer } from 'mobx-react';

import Tab from '@c/tab';

import Header from '../header';
import ApiList from './list';
import GroupSetting from './group-setting';
import ApiKeys from './api-keys';

import store from '../stores';

function ListPage() {
  return (
    <>
      <Header name={store.activeGroup?.name} />
      <Tab
        items={[
          {
            id: 'api-list',
            name: 'API 列表',
            content: <ApiList/>,
          },
          {
            id: 'group-setting',
            name: '分组配置',
            content: <GroupSetting/>,
          },
          {
            id: 'api-keys',
            name: 'API 密钥',
            content: <ApiKeys />,
          },
        ]}
      />
    </>
  );
}

export default observer(ListPage);
