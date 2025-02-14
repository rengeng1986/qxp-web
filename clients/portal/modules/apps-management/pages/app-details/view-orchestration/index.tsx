import React, { useCallback, useEffect, useState } from 'react';
import { observer } from 'mobx-react';

import PageLoading from '@c/page-loading';
import Icon from '@c/icon';
import Tooltip from '@c/tooltip';
import Modal from '@c/modal';
import { toast } from '@one-for-all/ui';

import ViewList from './view-list';
import ViewDetails from './view-details';
import EditViewModal from './view-creation-modal';
import { deleteSchema } from '../data-models/api';

import EditStaticViewModal from './view-details/edit-static-view-modal';
import pageTemplatesStore from '@portal/modules/apps-management/page-templates/store';
import CreateFromTemplate from './create-from-template';

import useAppStore from './hooks';

import appStore from '../store';

import { CreateViewParams, StaticView, TableSchemaView, View, ViewType } from '../view-orchestration/types.d';

import './index.scss';

function AppViews(): JSX.Element {
  const { isLoading, store } = useAppStore();
  const [btnLoading, setBtnLoading] = useState<boolean>(false);

  const handleModalSubmit = useCallback(
    (viewInfo: CreateViewParams<View>): void => {
      setBtnLoading(true);
      store
        ?.handleViewInfoSubmit(viewInfo)
        .then(() => {
          toast.success((store.modalType === 'createView' ? '添加' : '修改') + '成功');
          closeModal();
        })
        .catch(() => {
          toast.error('修改失败，请重试');
        })
        .finally(() => {
          setBtnLoading(false);
        });
    },
    [store?.modalType],
  );

  function closeModal(): void {
    store?.setModalType('');
  }

  function onViewOptionClick(key: string, view: View): void {
    store?.setCurrentView(view);
    store?.setModalType(key);
    if (key === 'delView') {
      const delViewModal = Modal.open({
        title: '删除页面',
        content: `确定要删除页面 ${view.name} 吗?`,
        confirmText: '确认删除',
        onConfirm: () => {
          store
            ?.deleteViewOrLayout(view.id)
            .then(() => {
              delViewModal.close();
              toast.success(`已删除页面 ${view.name} `);
              if ((view as TableSchemaView).tableID) {
                deleteSchema(store.appID, (view as TableSchemaView).tableID);
              }
            })
            .catch((err) => {
              toast.error(err);
            });
        },
      });
    }
    if (key === 'setHomeView') {
      store?.setHomeView(view.name).then(() => {
        toast.success(`已将 ${view.name} 设置为应用主页`);
      });
    }

    if (
      key === 'saveAsTemplate' &&
      (view.type === ViewType.SchemaView || view.type === ViewType.TableSchemaView)
    ) {
      if (view.type === ViewType.SchemaView) {
        pageTemplatesStore.createTemplate({
          type: 'artery',
          name: view.name,
          arteryID: view.arteryID,
        });
      } else {
        pageTemplatesStore.createTemplate({
          type: 'form',
          appID: view.appID,
          tableID: view.tableID,
          name: view.name,
        });
      }
    }
  }

  useEffect(() => {
    if (appStore.lastFocusViewID && store) {
      const view = store.views.find((view) => (view as View).id === appStore.lastFocusViewID );
      store.setCurrentView(view as View);
    }
  }, [store]);

  if (isLoading || !store) {
    return (
      <div className="flex h-full">
        <div className="app-details-nav">
          <PageLoading />
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full">
      <div className="app-details-nav rounded-tl-8 bg-gray-50">
        <div className="h-44 flex flex-end items-center px-16 py-20 justify-center">
          <span className="font-semibold text-gray-400 mr-auto text-12">页面</span>
          <div className="flex items-center">
            <div onClick={() => store.setModalType('createView')}>
              <Tooltip label="新建页面" position="top" theme="dark">
                <Icon className="cursor-pointer mr-8 hover:text-blue-600" size={16} name="post_add" />
              </Tooltip>
            </div>
            <CreateFromTemplate />
          </div>
        </div>
        <div style={{ height: 'calc(100% - 44px)' }} className="app-view-list-wrapper h-full">
          <ViewList
            currentView={store.currentView as View}
            homeView={store.homeView}
            views={store.views as View[]}
            onViewClick={(view) => {
              store.setCurrentView(view);
              appStore.setLastFocusViewID(view.id);
            }}
            onOptionClick={onViewOptionClick}
          />
        </div>
      </div>
      <ViewDetails openModal={(type) => store.setModalType(type)} viewInfo={store.currentView as View} />
      {['editView', 'createView'].includes(store.modalType) && (
        <EditViewModal
          modalType={store.modalType}
          layouts={store.layouts || []}
          views={store.views || []}
          onCancel={closeModal}
          viewParams={store.modalType === 'editView' ? (store.currentView as View) : undefined}
          onSubmit={handleModalSubmit}
          isPending={btnLoading}
        />
      )}
      {store.modalType === 'editStaticView' && (
        <EditStaticViewModal
          view={store.currentView as StaticView}
          onClose={closeModal}
          onSubmit={handleModalSubmit}
        />
      )}
    </div>
  );
}

export default observer(AppViews);
