import React from 'react';
import cs from 'classnames';
import { Input } from 'antd';
import { UnionColumn } from 'react-table';
import { observer } from 'mobx-react';
import dayjs from 'dayjs';

import Icon from '@c/icon';
import { Table, Button, Pagination } from '@one-for-all/headless-ui';
import Modal from '@c/modal';
import Search from '@c/search';
import PopConfirm from '@c/pop-confirm';
import TableMoreFilterMenu from '@c/more-menu/table-filter';
import { copyContent } from '@lib/utils';

import store from '../store';
import BuildModal from './build-modal';
import StatusDisplay from '../component/status';
import { getFuncInfo, getGitLabDomain } from '../api';

import '../index.scss';

const { TextArea } = Input;

function DataList(): JSX.Element {
  const { setModalType, updateFuncDesc } = store;

  function getDomain(name: string): void {
    getGitLabDomain().then((res) => {
      copyContent(`git clone ${res.domain}${store.appDetails.appSign}/${name}.git`);
    });
  }

  const COLUMNS: UnionColumn<FuncField>[] = [
    {
      Header: '名称',
      id: 'alias',
      accessor: (info: FuncField) => {
        return (
          <span
            className="text-blue-600 cursor-pointer"
            onClick={() => onClickTool(info, 'funDetail')}
          >
            {info.alias}
          </span>
        );
      },
    },
    {
      Header: '标识',
      id: 'name',
      accessor: 'name',
    },
    {
      Header: () => {
        return (
          <TableMoreFilterMenu
            menus={[
              { key: 'SUCCESS', label: '成功' },
              { key: 'ING', label: '进行中' },
              { key: 'FAILED', label: '失败' },
            ]}
            onChange={() => console.log('')}
          >
            <div className={cs('flex items-center cursor-pointer', {
              'pointer-events-none': true,
            })}>
              <span className="mr-4">状态</span>
              <Icon name="funnel" />
            </div>
          </TableMoreFilterMenu>
        );
      },
      id: 'status',
      accessor: ({ state, id, message }: FuncField) => {
        return (
          <StatusDisplay
            errorMsg={message}
            status={state || 'Unknown'}
            topic='project'
            dataID={id}
            callBack={async (data) => {
              const { key }: FaasSoketData = data?.content || {};
              if (key !== id) {
                return;
              }

              const res = await getFuncInfo(store.groupID, id);
              if (res.info.state !== 'Unknown') {
                store.mutateFuncStatus(id, res.info.state);
              }
            }} />
        );
      },
    },
    {
      Header: '描述',
      id: 'description',
      accessor: ({ id, description }: FuncField) => {
        let descriptionValue = description;
        return (
          <div className="flex items-center description">
            <span className="truncate flex-1 max-w-min" title={description}>{description}</span>
            <PopConfirm
              content={(
                <div
                  className="flex flex-col"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="text-gray-600 mb-8" >描述</div>
                  <TextArea
                    name="name"
                    defaultValue={description}
                    maxLength={100}
                    className="description-input"
                    onChange={(e) => descriptionValue = e.target.value}
                  />
                </div>
              )}
              okText="保存"
              onOk={() => updateFuncDesc(id, descriptionValue)}
            >
              <Icon clickable name='edit' className="ml-4 cursor-pointer" />
            </PopConfirm>
          </div>
        );
      },
    },
    {
      Header: '创建人',
      id: 'creator',
      accessor: 'creator',
    },
    {
      Header: '创建时间',
      id: 'createdAt',
      accessor: ({ createdAt }: FuncField) => {
        return createdAt ? dayjs(parseInt(String(createdAt * 1000))).format('YYYY-MM-DD HH:mm:ss') : '—';
      },
    },
    {
      Header: '操作',
      id: 'action',
      accessor: (info: FuncField) => {
        return (
          <div className="flex gap-20">
            {info.state === 'True' && (
              <>
                <span className="operate" onClick={() => getDomain(info.name)}>复制clone地址</span>
                <span className="operate" onClick={() => onClickTool(info, 'build')}>构建</span>
                <span className="cursor-pointer text-red-600" onClick={() => onClickTool(info, 'deletefunc')}>
                  删除
                </span>
              </>
            )}
            {info.state === 'False' && (
              <span className="cursor-pointer text-red-600" onClick={() => onClickTool(info, 'deletefunc')}>
                删除
              </span>
            )}
            {(info.state === 'Unknown' || !info.state) && <span>-</span>}
          </div>
        );
      },
    },
  ];

  function onClickTool(info: FuncField, type: string): void {
    store.currentFunc = info;
    store.currentFuncID = info.id;
    store.modalType = type;
  }

  function handleInputKeydown(e: React.KeyboardEvent): void {
    if (e.key !== 'Enter') {
      return;
    }
    store.fetchFuncList(store.searchAlias, 1, 10);
  }

  return (
    <>
      <div className="flex justify-between mb-8">
        <Button
          iconName="add"
          modifier="primary"
          textClassName="text-12"
          onClick={() => setModalType('editModel')}
        >
          新建函数
        </Button>
        <Search
          className="func-search text-12"
          placeholder="搜索函数名称"
          onChange={(v) => {
            if (!v) store.fetchFuncList('', 1, 10);
            setTimeout(() => {
              store.searchAlias = v;
            }, 500);
          }}
          onKeyDown={handleInputKeydown}
        />
      </div>

      <div className='flex-1 overflow-hidden'>
        <Table
          rowKey="id"
          data={store.funcList}
          columns={COLUMNS}
          loading={store.funcListLoading}
        />
      </div>
      <Pagination
        total={store.funcList.length}
        renderTotalTip={() => `共 ${store.funcList.length} 条数据`}
        onChange={(current, pageSize) => store.fetchFuncList(store.searchAlias, current, pageSize)}
      />
      {store.modalType === 'build' && <BuildModal onClose={() => store.modalType = ''} />}
      {store.modalType === 'deletefunc' && (
        <Modal
          title="删除函数"
          onClose={() => store.modalType = ''}
          footerBtns={[
            {
              text: '取消',
              key: 'cancel',
              onClick: () => store.modalType = '',
            },
            {
              text: '确定',
              key: 'confirm',
              modifier: 'primary',
              onClick: () => store.deleteFunc(),
            },
          ]}
        >
          <p className="text-h5 p-20">
            确定要删除函数
            <span className="font-bold mx-8">
              {store.currentFunc.alias}
            </span>
            吗？删除后将无法恢复！
          </p>
        </Modal>
      )
      }
    </>
  );
}

export default observer(DataList);
