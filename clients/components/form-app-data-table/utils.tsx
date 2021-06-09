import React from 'react';
import moment from 'moment';
import { transform, isEqual, isArray, isObject } from 'lodash';

import { UnionColumns } from 'react-table';

export type Scheme = Record<string, any>;
export type PageTableShowRule = {
  fixedRule?: string;
  order?: string;
  pageSize?: number | null;
}
export type Config = {
  filters?: Filters;
  pageTableColumns?: string[];
  pageTableShowRule?: PageTableShowRule;
};

type Option = {
  value: string;
  label: string;
}

export function operateButton(wIndex: number, authority: number, button: React.ReactNode) {
  const weightArr = authority.toString(2).split('').reverse();
  if (weightArr.length < 7) {
    for (let index = 0; index < 7 - weightArr.length; index += 1) {
      weightArr.push('0');
    }
  }
  if (weightArr[wIndex - 1] === '0') {
    return null;
  }

  return button;
}

export function getTableCellData(
  initValue: string | string[] | Record<string, unknown>,
  field: ISchema,
): string | JSX.Element | Record<string, any>[] {
  if (!initValue) {
    return (<span className='text-gray-300'>——</span>);
  }

  if (field.type === 'datetime') {
    const format = field['x-component-props']?.format || 'YYYY-MM-DD HH:mm:ss';
    if (Array.isArray(initValue)) {
      return initValue.map((value: string) => {
        return moment(value).format(format);
      }).join('-');
    }

    return moment(initValue).format(format);
  }

  if (field.enum && field.enum.length) {
    if (Array.isArray(initValue)) {
      return initValue.map((_value: string) => {
        if (!field.enum) {
          return '';
        }

        const enumTmp = field.enum[0];
        if (typeof enumTmp === 'object') {
          return (field.enum.find(({ value }: any) => value === _value) as Option)?.label || '';
        }

        return _value;
      }).join(',');
    }

    if (typeof field.enum[0] === 'object') {
      return (field.enum.find(({ value }: any) => value === initValue) as Option)?.label || '';
    }

    return initValue as string;
  }

  if (field['x-component']?.toLowerCase() === 'subtable') {
    return initValue as unknown as Record<string, any>[];
  }

  if (Array.isArray(initValue)) {
    return initValue.join(',');
  }

  if (typeof initValue === 'string') {
    return initValue;
  }

  if (initValue?.label) {
    return initValue?.label as string;
  }

  return initValue.toString();
}

function addFixedParameters(fixedList: number[], tableColumns: UnionColumns<Record<string, any>>[]) {
  fixedList.forEach((index) => {
    if (tableColumns[index]) {
      tableColumns[index] = { ...tableColumns[index], fixed: true, width: 150 };
    }
  });
}

export function setFixedParameters(
  fixedRule: string | undefined,
  tableColumns: UnionColumns<Record<string, any>>[],
) {
  let action: UnionColumns<any> = {
    id: 'action',
    Header: '操作',
  };
  switch (fixedRule) {
  case 'one':
    addFixedParameters([0], tableColumns);
    break;
  case 'previous_two':
    addFixedParameters([0, 1], tableColumns);
    break;
  case 'action':
    action = { ...action, fixed: true, width: 150 };
    break;
  case 'one_action':
    addFixedParameters([0], tableColumns);
    action = { ...action, fixed: true, width: 150 };
    break;
  }
  return [...tableColumns, action];
}

export function getPageDataSchema(
  config: Config,
  schema: Scheme,
) {
  const { pageTableShowRule = {}, pageTableColumns = [] } = config || {};
  const fieldsMap = schema?.properties || {};
  const tableColumns: UnionColumns<any>[] = pageTableColumns.map((key) => {
    return {
      id: key,
      Header: fieldsMap[key].title || '',
      accessor: (data: any) => getTableCellData(data[key], fieldsMap[key]),
    };
  });

  return {
    tableColumns: setFixedParameters(pageTableShowRule.fixedRule, tableColumns),
    pageTableShowRule,
  };
}

export function difference(origObj: Record<string, unknown>, newObj: Record<string, unknown>) {
  function changes(newObj: Record<string, unknown>, origObj: Record<string, unknown>) {
    let arrayIndexCounter = 0;
    return transform(newObj, function(
      result: Record<string, unknown>,
      value: any,
      key,
    ) {
      if (!isEqual(value, origObj[key])) {
        // eslint-disable-next-line no-plusplus
        const resultKey = isArray(origObj) ? arrayIndexCounter++ : key;
        result[resultKey] = (isObject(value) && isObject(origObj[key])) ?
          changes(
            value as Record<string, unknown>,
            origObj[key] as Record<string, unknown>,
          ) : value;
      }
    });
  }
  return changes(newObj, origObj);
}
