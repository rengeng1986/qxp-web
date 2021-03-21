import React, { useEffect } from 'react';
import { useQuery } from 'react-query';
import { observer } from 'mobx-react';

import { Table } from '@portal/components/table';
import { EmptyData } from '@portal/components/empty-data';
import { Pagination } from '@portal/components/pagination2';
import { adminSearchUserList, IOwner } from '@portal/pages/access-control/role-management/api';
import { Loading } from '@portal/components/loading2';
import OwnerStore from '../store';

interface IEmployeeTable {
  className?: string;
  userName?: string;
  depID: string | null;
  ownerStore: OwnerStore;
}

export const EmployeeTable = observer(({
  className,
  depID,
  userName,
  ownerStore,
}: IEmployeeTable) => {
  const store = ownerStore.employeeStore;
  const { current, pageSize, total } = store.pagination;

  const { data, isLoading } = useQuery(
    [
      'adminSearchUserList',
      { depID, userName, page: current, limit: pageSize },
    ],
    adminSearchUserList,
    {
      refetchOnWindowFocus: false,
      enabled: !!depID,
    },
  );

  useEffect(() => {
    if (data?.total) {
      store.setTotal(data.total);
    }
    if (data?.users) {
      store.initialSelectedKeys(data.users, ownerStore.owners);
    }
  }, [data]);

  if (isLoading) {
    return <Loading desc="加载中..." />;
  }

  return (
    <div style={{ height: 'calc(100% - 48px)' }} className={className}>
      <Table
        className="rounded-bl-none rounded-br-none"
        onRow={(record: IOwner) => {
          return {
            onClick: () => store.toggleSelectedKeys(record.id),
          };
        }}
        emptyText={<EmptyData text="无成员数据" className="py-10" />}
        rowKey="id"
        dataSource={data?.users || []}
        columns={[
          {
            title: '员工姓名',
            dataIndex: 'userName',
          },
          {
            title: '手机号',
            dataIndex: 'phone',
          },
          {
            title: '邮箱',
            dataIndex: 'email',
          },
          {
            title: '部门',
            dataIndex: 'dep.departmentName',
          },
        ]}
        rowSelection={{
          selectedRowKeys: store.selectedKeys,
          onChange: store.setSelectedKeys,
        }}
      />
      <Pagination
        type="simple"
        {...store.pagination}
        onShowSizeChange={store.setPageSize}
        onChange={store.setCurrentPage}
        prefix={
          <span className="text-1-dot-2 text-dark-four">
            {`已选 ${store.selectedKeys.length}, 共 ${total}条`}
          </span>
        }
      />
    </div>
  );
});
