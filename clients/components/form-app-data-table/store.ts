import React from 'react';
import { UnionColumns } from 'react-table';
import { action, observable, reaction, IReactionDisposer } from 'mobx';

import toast from '@lib/toast';
import httpClient from '@lib/http-client';

import { Scheme, Config, getPageDataSchema } from './utils';

type Params = {
  condition?: Condition[] | [],
  tag?: 'or' | 'and',
  sort?: string[] | [],
  page?: number,
  size?: number,
}

type InitData = {
  schema: ISchema;
  config?: Config;
  pageID?: string;
  appID?: string;
  pageName?: string;
  allowRequestData?: boolean;
}

export type FormData = Record<string, any>;

class AppPageDataStore {
  destroyFetchTableData: IReactionDisposer;
  destroySetTableConfig: IReactionDisposer;
  @observable tableConfig: any = {};
  @observable noFiltersTips: React.ReactNode = '尚未配置筛选条件。'
  @observable listLoading = false;
  @observable pageID = '';
  @observable appID = '';
  @observable pageName = '';
  @observable authority = 0;
  @observable rowID: string | null = null;
  @observable allowRequestData = false;
  @observable filters: Filters = [];
  @observable formDataList: any[] = [];
  @observable total = 0;
  @observable fields: Fields[] = [];
  @observable schema: ISchema = {};
  @observable filterData: FormData = {};
  @observable tableColumns: any[] = [];
  @observable createPageVisible = false;
  @observable params: Params = {
    condition: [],
    sort: [],
    page: 1,
    size: 10,
    tag: 'and',
  };

  constructor({ schema, pageID, pageName, appID, config, allowRequestData }: InitData) {
    const { tableColumns, pageTableShowRule } = getPageDataSchema(config || {}, schema);
    this.fields = Object.entries(schema.properties || {}).map(([key, fieldSchema])=>{
      return {
        id: key,
        ...fieldSchema,
      };
    });
    this.setTableColumns(tableColumns);
    this.setTableConfig(pageTableShowRule);
    this.destroyFetchTableData = reaction(() => this.params, this.fetchFormDataList);
    this.destroySetTableConfig = reaction(() => {
      return {
        size: this.tableConfig.pageSize || 9999,
        sort: this.tableConfig.order ? [this.tableConfig.order] : [],
      };
    }, this.setParams);
    this.schema = schema || {};
    this.pageName = pageName || '';
    this.appID = appID || '';
    this.pageID = pageID || '';
    this.allowRequestData = !!allowRequestData;

    if (config?.filters) {
      this.setFilters(config.filters || []);
    }
  }

  @action
  setParams = (params: Params) => {
    this.params = { ...this.params, ...params };
  }

  @action
  setSchema = (schema: Scheme | undefined) => {
    if (!schema) {
      return;
    }

    this.schema = schema;
    this.fields = Object.keys(this.schema).map((key) => ({
      id: key,
      ...schema.properties[key],
    }));
  }

  @action
  setTableConfig = (tableConfig: any) => {
    this.tableConfig = tableConfig;
  }

  @action
  setFilters = (filters: Filters) => {
    this.filters = filters;
  }

  @action
  setTableColumns = (tableColumns: UnionColumns<any>[]) => {
    this.tableColumns = tableColumns;
  }

  @action
  setVisibleCreatePage = (createPageVisible: boolean) => {
    if (!createPageVisible) {
      this.rowID = null;
    }
    this.createPageVisible = createPageVisible;
  }

  @action
  goEdit = (formDataID: string | null) => {
    if (!formDataID) {
      return;
    }
    this.rowID = formDataID;
    this.setVisibleCreatePage(true);
  }

  @action
  delFormData = (ids: string[]) => {
    return httpClient(`/api/v1/structor/${this.appID}/` +
      `${window.SIDE === 'portal' ? 'm' : 'home'}/form/${this.pageID}`, {
      method: 'delete',
      conditions: { condition: [{ key: '_id', op: ids.length > 1 ? 'in' : 'eq', value: ids }] },
    }).then(() => {
      this.formDataList = this.formDataList.filter(({ _id }) => !ids.includes(_id));
      toast.success('删除成功!');
    });
  }

  @action
  fetchFormDataList = (params: Params) => {
    if (!this.allowRequestData || !this.pageID) {
      return;
    }

    this.listLoading = true;
    const side = window.SIDE === 'portal' ? 'm' : 'home';
    const { condition, tag, ...other } = params;
    httpClient(`/api/v1/structor/${this.appID}/${side}/form/${this.pageID}`, {
      method: 'find',
      page: 1,
      conditions: { tag: tag, condition },
      sort: [],
      ...other,
    }).then((res: any) => {
      this.formDataList = res.entities;
      this.total = res.total || 0;
      this.listLoading = false;
    }).catch(() => {
      this.listLoading = false;
    });
  }

  @action
  fetchFormDataDetails = (dataID: string) => {
    const side = window.SIDE === 'portal' ? 'm' : 'home';
    return httpClient(`/api/v1/structor/${this.appID}/${side}/form/${this.pageID}`, {
      method: 'findOne',
      conditions: {
        condition: [
          {
            key: '_id',
            op: 'eq',
            value: [dataID],
          },
        ],
        tag: 'and',
      },
    }, { 'X-Proxy': 'FORM_DATA' });
  }

  @action
  fetchActionAuthorized = () => {
    if (!this.pageID) {
      return;
    }

    const side = window.SIDE === 'portal' ? 'm' : 'home';
    httpClient(
      `/api/v1/structor/${this.appID}/${side}/permission/operatePer/getOperate`,
      { formID: this.pageID },
    ).then((res: any) => {
      this.authority = res?.authority || 0;
    });
  }

  @action
  clear = () => {
    this.rowID = null;
    this.formDataList = [];
    this.tableConfig = {};
    this.authority = 0;
    this.filters = [];
    this.tableColumns = [];
    this.pageID = '';
    this.params = {
      condition: [],
      sort: [],
      page: 1,
      size: 10,
    };
  }
}

export default AppPageDataStore;
