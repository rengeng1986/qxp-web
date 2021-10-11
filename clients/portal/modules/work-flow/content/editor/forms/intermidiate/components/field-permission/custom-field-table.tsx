import React, { useContext } from 'react';
import { noop } from 'lodash';
import { without } from 'ramda';

import Table from '@c/table';
import Checkbox from '@c/checkbox';
import ToolTip from '@c/tooltip';
import Icon from '@c/icon';
import useRequest from '@lib/hooks/use-request';
import type { CustomFieldPermission, FieldValue } from '@flow/content/editor/type';
import flowContext from '@flow/flow-context';
import { FORM_COMPONENT_VARIABLE_MAP } from '@flow/content/editor/utils/constants';
import type { PERMISSION_KEY } from '@c/form-builder/constants';

import FieldValueEditor from './field-value-editor';
import { schemaToArray, schemaToMap } from '@lib/schema-convert';

interface Props {
  fields: CustomFieldPermission[];
  updateFields: (value: CustomFieldPermission[]) => void;
  editable: boolean;
  schema: ISchema;
}

export default function CustomFieldTable({
  editable, fields, updateFields: _updateFields, schema,
}: Props): JSX.Element {
  const { flowID: flowId } = useContext(flowContext);
  const schemaMap = schemaToMap(schema);
  const layoutFields = schemaToArray(schema, { parseSubTable: true, keepLayout: true })
    .reduce((layoutFields: string[], schema) => {
      const internal = schema['x-internal'];
      if (internal?.isLayoutComponent && internal.fieldId) {
        layoutFields.push(internal.fieldId);
      }
      return layoutFields;
    }, []);

  const [data] = useRequest<{
    code: number;
    data: ProcessVariable[];
    msg: string;
  }>(`/api/v1/flow/getVariableList?id=${flowId}`, {
    method: 'POST',
    credentials: 'same-origin',
  });

  const variableOptions = data?.data?.map(({ name, code, fieldType }) => ({
    label: name, value: code, type: fieldType,
  }));

  function updateFields(_fields: CustomFieldPermission[]): void {
    _updateFields([..._fields, ...fields.filter((field) => field.hidden)]);
  }

  function getHeader(model: any, key: PERMISSION_KEY, label: string): JSX.Element {
    let checkedNumber = 0;
    model.data.forEach((dt: CustomFieldPermission) => {
      if (dt[key]) {
        checkedNumber += 1;
      }
    });
    const indeterminate = checkedNumber < model.data.length && checkedNumber > 0;
    const isChecked = checkedNumber === model.data.length;
    return (
      <div className="flex items-center">
        <Checkbox
          indeterminate={indeterminate}
          checked={isChecked}
          onChange={noop}
          onClick={() => {
            if (indeterminate || checkedNumber === 0) {
              return updateFields(model.data.map((dt: CustomFieldPermission) => {
                return {
                  ...dt,
                  [key]: true,
                  ...(key === 'write' ? { read: true } : {}),
                  ...(key === 'invisible' ? { read: true, editable: false } : {}),
                  ...(key === 'editable' ? { read: true, invisible: false, write: true } : {}),
                };
              }));
            }
            if (isChecked) {
              return updateFields(model.data.map((dt: CustomFieldPermission) => {
                return {
                  ...dt,
                  [key]: false,
                  ...(key === 'write' ? { editable: false } : {}),
                  ...(key === 'read' ? { write: false, invisible: false, editable: false } : {}),
                };
              }));
            }
          }}
        />
        <span className="ml-8">{label}</span>
      </div>
    );
  }

  function getValueHeader(label: string, tip: string): JSX.Element {
    return (
      <div className="flex items-center">
        <span className="mr-4">{label}</span>
        <ToolTip
          inline
          labelClassName="whitespace-nowrap text-12 py-8 px-16"
          position="left"
          label={tip}
        >
          <Icon name="info" size={20} />
        </ToolTip>
      </div>
    );
  }

  function getCell(model: any, key?: PERMISSION_KEY): JSX.Element {
    const isChecked = model.cell.value;
    if (!key) {
      const path = without(layoutFields, model.cell.row.original.path?.split('.') || []);
      const level = path.length - 1 > 0 ? path.length - 1 : 0;
      return <div style={{ marginLeft: isNaN(level) ? 0 : level * 20 }}> {model.cell.value} </div>;
    }

    return (
      <Checkbox
        checked={isChecked}
        onChange={noop}
        onClick={() => {
          updateFields(model.data.map((dt: CustomFieldPermission) => {
            if (dt.id === model.cell.row.id) {
              return {
                ...dt,
                [key]: !isChecked,
                ...(key === 'write' && !isChecked ? { read: true } : {}),
                ...(key === 'write' && isChecked ? { editable: false } : {}),
                ...(key === 'read' && isChecked ? { write: false, invisible: false, editable: false } : {}),
                ...(key === 'invisible' && !isChecked ? { read: true, editable: false } : {}),
                ...(key === 'editable' && !isChecked ? { read: true, invisible: false, write: true } : {}),
              };
            }
            return dt;
          }));
        }}
      />
    );
  }

  function variableOptionsFilterByType(schema: SchemaFieldItem) {
    return ({ type }: Partial<FlowVariableOption>): boolean => {
      const componentName = schema.componentName || '';
      const types = FORM_COMPONENT_VARIABLE_MAP[componentName as keyof typeof FORM_COMPONENT_VARIABLE_MAP];
      return type ? types?.includes(type) : false;
    };
  }

  function getValueCell(
    model: any, key: 'initialValue' | 'submitValue', editable: boolean,
  ): JSX.Element | null {
    const schema = schemaMap[model.cell.row.id];
    const componentName = schema?.componentName;
    const isSubTable = componentName === 'subtable';
    const isAssociatedRecords = componentName === 'associatedrecords';
    if (editable && schema && !isSubTable && !isAssociatedRecords) {
      if (schema['x-mega-props']) {
        schema['x-mega-props'].labelAlign = 'top';
      }
      return (
        <FieldValueEditor
          variableOptions={variableOptions?.filter(variableOptionsFilterByType(schema))}
          defaultValue={model.cell.value}
          schema={{
            title: '',
            type: 'object',
            properties: {
              [model.cell.row.id]: schema,
            },
          }}
          onSave={(value: FieldValue) => {
            updateFields(model.data.map((dt: CustomFieldPermission) => {
              if (dt.id === model.cell.row.id) {
                return {
                  ...dt,
                  [key]: value,
                };
              }
              return dt;
            }));
          }}
        />
      );
    }
    return null;
  }

  return (
    <Table
      rowKey="id"
      columns={[{
        Header: '字段',
        accessor: 'fieldName',
        Cell: (model: any) => getCell(model),
        fixed: true,
      }, {
        Header: (model: any) => getHeader(model, 'read', '查看'),
        accessor: 'read',
        Cell: (model: any) => getCell(model, 'read'),
      }, {
        Header: (model: any) => getHeader(model, 'write', '写入'),
        accessor: 'write',
        Cell: (model: any) => getCell(model, 'write'),
      }, {
        Header: (model: any) => getHeader(model, 'editable', '编辑'),
        accessor: 'editable',
        Cell: (model: any) => getCell(model, 'editable'),
      }, {
        Header: (model: any) => getHeader(model, 'invisible', '隐藏'),
        accessor: 'invisible',
        Cell: (model: any) => getCell(model, 'invisible'),
      }, {
        Header: () => getValueHeader('初始值', '该节点初次打开工作表时对应字段呈现初始值'),
        accessor: 'initialValue',
        Cell: (model: any) => getValueCell(model, 'initialValue', editable),
      }, {
        Header: () => getValueHeader('提交值', '该节点提交工作表后对应字段呈现提交值'),
        accessor: 'submitValue',
        Cell: (model: any) => !model.cell.row.original.write &&
          getValueCell(model, 'submitValue', editable),
      }]}
      data={fields.filter((field) => !field.hidden)}
    />
  );
}
