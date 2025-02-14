import React, { useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import { observer } from 'mobx-react';

import Tab from '@c/tab';
import TextHeader from '@c/text-header';
import SearchInput from '@c/form/input/search-input';
import Loading from '@c/loading';
// todo remove this
import {
  getDepartmentStructure,
} from '@portal/modules/access-control/role-management/api';
import ErrorTips from '@c/error-tips';

import EmployeeTable from './employee-table';
import SelectedList from './selected-list';
import EmployeeSelectTree from './employee-select-tree';
import DepartmentSelectTree from './department-select-tree';
import OwnerStore from './store';

interface Props {
  departments?: EmployeeOrDepartmentOfRole[];
  employees?: EmployeeOrDepartmentOfRole[];
  onChange: (departmentsOrEmployees: EmployeeOrDepartmentOfRole[]) => void;
  onlyEmployees?: boolean;
}

export default observer(function EmployeeOrDepartmentPicker({
  departments = [], employees = [], onChange, onlyEmployees,
}: Props) {
  const [store, setStore] = useState<OwnerStore>();

  const { data: department, isLoading, isError } = useQuery(
    ['GET_DEPARTMENT_STRUCTURE'],
    getDepartmentStructure,
    {
      refetchOnWindowFocus: false,
    },
  );

  useEffect(() => {
    store?.owners && onChange(store.owners);
  }, [store?.owners.length]);

  const onDepartmentTreeChange = (prevNodes: Department[], currentNodes: Department[]) => {
    if (!store) {
      return;
    }
    const add: EmployeeOrDepartmentOfRole[] = [];
    const remove: string[] = [];
    currentNodes.filter((node) => !prevNodes.find((n) => n.id === node.id)).forEach((node) => {
      const parent = store.departmentTreeStore.getNodeParents(node.id)[0];
      add.push({
        type: 2,
        ownerID: node.id,
        ownerName: node.name,
        phone: '',
        email: '',
        departmentName: parent?.name,
        departmentID: parent?.id,
        createdAt: -1,
        id: node.id,
      });
    });
    prevNodes.filter((node) => !currentNodes.find((n) => n.id === node.id)).forEach((node) => {
      remove.push(node.id);
    });
    add.length && store.addOwners(add);
    remove.length && store.removeOwners(remove);
  };

  useEffect(() => {
    if (department) {
      setStore(new OwnerStore(department, [...departments, ...employees]));
    }
  }, [department, departments, employees]);

  if (!store || isLoading) {
    return <Loading desc="加载中..." />;
  }
  if (isError) {
    return <ErrorTips desc="something wrong" />;
  }

  const renderEmployeePanel = () => {
    return (
      <>
        <SearchInput
          className="mb-16"
          name="username"
          placeholder="搜索员工姓名..."
          onChange={(value) => store.setUsernameKeyword(value)}
          appendix="close"
        />
        <div className="flex flex-row mr-4" style={{ height: 'calc(100% - 48px)' }}>
          <div
            className="w-221 h-full flex flex-col overflow-hidden mr-20 border-r border-gray-200">
            <TextHeader
              className="mb-8 pb-0"
              title="选择部门"
              itemTitleClassName="text-h6-no-color-weight font-semibold"
              descClassName="text-caption"
            />
            <EmployeeSelectTree
              store={store.employeeTreeStore}
              className="employee-select-tree"
              wrapperClassName="flex-1 bg-white rounded-12 border-gray-200"
            />
          </div>
          <div className="h-full flex flex-col overflow-hidden flex-5">
            <TextHeader
              className="mb-8 pb-0"
              title={store.employeeTreeStore.currentFocusedNode.name || ''}
              itemTitleClassName="text-h6-no-color-weight font-semibold"
            />
            <EmployeeTable
              userName={store.usernameKeyword}
              depID={store.employeeTreeStore.currentFocusedNode.id || ''}
              ownerStore={store}
            />
          </div>
        </div>
      </>
    );
  };

  const renderDepartmentPanel = () => {
    return (
      <>
        {/* <SearchInput
                  className="mb-8"
                  name="departmentName"
                  placeholder="搜索部门名称姓名..."
                  onChange={store.setDepartmentKeyword}
                  appendix="close"
                /> */}
        <div
          className="h-full flex flex-col overflow-hidden"
          style={{ height: 'calc(100% - 48px)' }}
        >
          <TextHeader
            className="pb-0"
            title="选择部门"
            itemTitleClassName="text-h6-no-color-weight font-semibold"
            desc="角色关联部门后，在该部门下添加员工时会默认自动带入该部门的角色。例如：部门关联角色“普通管理员”，添加新员工时，自动关联角色“普通管理员”。"
            itemClassName="flex flex-col items-start"
            textClassName="ml-0 mt-4"
            descClassName="mb-8 text-caption"
          />
          <DepartmentSelectTree
            store={store.departmentTreeStore}
            wrapperClassName="flex-1 bg-white rounded-12"
            onChange={onDepartmentTreeChange}
          />
        </div>
      </>
    );
  };

  const items = [
    {
      id: '1',
      name: '按员工',
      content: renderEmployeePanel(),
    },
  ];

  if (!onlyEmployees) {
    items.push({
      id: '2',
      name: '按部门',
      content: renderDepartmentPanel(),
    });
  }

  return (
    <div className="flex flex-row w-full h-full p-20">
      <Tab
        className="mr-20 flex-2"
        contentClassName="rounded-12 rounded-tl-none"
        currentKey={store.tabKey}
        onChange={(key) => store.setTabKey(key as string)}
        items={items}
      />
      <div className="vertical-line flex-grow-0" />
      <SelectedList
        ownerStore={store}
      />
    </div>
  );
});
