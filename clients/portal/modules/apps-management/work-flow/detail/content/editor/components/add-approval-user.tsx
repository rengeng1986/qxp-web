import React, { useState, forwardRef } from 'react';
import cs from 'classnames';

import Tag from '@c/tag';
import Icon from '@c/icon';
import EmployeeOrDepartmentPicker from '@c/employee-or-department-picker';

type Value = {
  departments: EmployeeOrDepartmentOfRole[],
  employees: EmployeeOrDepartmentOfRole[]
}

type Props = {
  value: Value;
  onChange: (selected: Value) => void;
}

const tagBackgroundColorMap = {
  1: 'var(--blue-100)',
  2: 'var(--yellow-100)',
};
const tagIconNameMap = {
  1: 'person-filled',
  2: 'device_hub',
};

function UserSelect({ value, onChange }: Props, ref:React.Ref<HTMLInputElement>): JSX.Element {
  const [employeeVisible, setVisible] = useState(false);

  const handleSubmit = (
    departments: EmployeeOrDepartmentOfRole[],
    employees: EmployeeOrDepartmentOfRole[],
  ): Promise<boolean> => {
    onChange({ departments, employees });
    return Promise.resolve(true);
  };

  const handleRemove = (member: EmployeeOrDepartmentOfRole): void => {
    const valueTmp = { ...value };
    if (member.type === 1) {
      valueTmp.employees = valueTmp.employees.filter(({ id })=>id !== member.id);
    } else {
      valueTmp.departments = valueTmp.departments.filter(({ id }) => id !== member.id);
    }
    onChange(valueTmp);
  };

  const { departments = [], employees = [] } = value || {};

  return (
    <div>
      {(departments.length !== 0 || employees.length !== 0) && (
        <div className="mt-8 mb-12 py-8 px-12 border border-gray-300 corner-2-8-8-8">
          {[...departments, ...employees].map((member) => (
            <Tag<string>
              className="mr-8 rounded-tl-4 rounded-br-4 mb-8 overflow-hidden h-24"
              style={{
                backgroundColor: tagBackgroundColorMap[member.type],
                paddingLeft: 0,
              }}
              key={member.id}
              id={member.id}
              value={(
                <div
                  className="rounded-tl-4 flex items-center mr-4 h-full"
                >
                  <div
                    className={cs('flex w-24 justify-center items-center mr-8 h-full', {
                      'bg-blue-600': member.type === 1,
                      'bg-yellow-600': member.type === 2,
                    })}
                  >
                    <Icon name={tagIconNameMap[member.type]} className="text-white" />
                  </div>
                  <span
                    className={cs({
                      'text-blue-600': member.type === 1,
                      'text-yellow-600': member.type === 2,
                    })}
                  >
                    {member.ownerName}
                  </span>
                </div>
              )}
              deleteIconSize={16}
              onDelete={() => handleRemove(member)}
            />
          ))}
        </div>
      )}
      <div
        onClick={() => setVisible(true)}
        className={cs(
          'flex items-center border border-dashed border-gray-300 corner-8-2-8-8',
          'py-5 text-button mb-24 mt-8 justify-center cursor-pointer h-32',
        )}
      >
        <Icon name="add" className="mr-8" size={20} />
        添加审批人
      </div>
      <input ref={ref} type='hidden' />
      {employeeVisible && (
        <EmployeeOrDepartmentPicker
          onSubmit={handleSubmit}
          submitText='保存'
          title='添加审批人'
          employees={value?.employees || []}
          departments={value?.departments || []}
          onCancel={() => setVisible(false)}
        />
      )}
    </div>
  );
}

export default forwardRef(UserSelect);
