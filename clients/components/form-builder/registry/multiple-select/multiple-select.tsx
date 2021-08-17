import React from 'react';
import { Select } from 'antd';
import { ISchemaFieldComponentProps } from '@formily/react-schema-renderer';

import useHandleOptions from '@lib/hooks/use-handle-options';

const { Option } = Select;

function MultipleSelect(fieldProps: ISchemaFieldComponentProps): JSX.Element {
  const options = useHandleOptions(fieldProps);

  function handleSelectChange(value: string[]): void {
    fieldProps.mutators.change(value);
  }

  return (
    <Select
      mode="multiple"
      value={fieldProps.value}
      onChange={handleSelectChange}
    >
      {
        options.map((option): JSX.Element => {
          return (
            <Option key={option.value} value={option.value}>{option.label}</Option>);
        })
      }
    </Select>
  );
}

MultipleSelect.isFieldComponent = true;

export default MultipleSelect;
