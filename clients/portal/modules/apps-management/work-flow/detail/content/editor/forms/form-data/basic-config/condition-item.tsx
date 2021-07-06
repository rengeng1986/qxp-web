import React, { useState, useEffect } from 'react';
import { omit, isArray } from 'lodash';
import cs from 'classnames';
import { useCss } from 'react-use';
import { DatePicker } from 'antd';

import Select from '@c/select';
import { Options, Option } from '@flowEditor/forms/api';
import type {
  Operator,
  TriggerConditionExpressionItem,
  FieldOperatorOptions,
  TriggerConditionValue,
} from '@flowEditor/type';
import FormRender from '@c/form-builder/form-renderer';
import { COMPONENT_OPERATORS_MAP, OPERATOR_OPTIONS } from '@flowEditor/utils/constants';
import moment, { Moment } from 'moment';

const { RangePicker } = DatePicker;

interface Props {
  condition: TriggerConditionValue;
  options: Options;
  schemaMap?: SchemaProperties;
  onChange: (value: Partial<TriggerConditionExpressionItem>) => void;
}

export type ConditionItemOptions = Options;

export default function ConditionItem({ condition, options, onChange, schemaMap }: Props): JSX.Element {
  const [value, setValue] = useState(condition.key);

  const currentOption = options.find((option) => option.value === value);

  const currentSchema = schemaMap?.[value || ''] || {};
  if (value && currentSchema) {
    currentSchema.display = true;
    currentSchema.readOnly = false;
  }

  const schema = {
    type: 'object',
    title: '',
    description: '',
    properties: {
      [value]: omit(currentSchema, 'title') as SchemaProperties,
    },
  };

  function onFieldChange(value: string): void {
    setValue(value);
    onChange({ key: value });
  }

  function fieldOperatorOptionsFilter(operatorOptions: FieldOperatorOptions, currentOption?: Option): {
    label: string; value: Operator; exclude?: string[] | undefined;
  }[] {
    const operators = COMPONENT_OPERATORS_MAP[
      schemaMap?.[currentOption?.value || '']
        ?.['x-component']?.toLowerCase() as keyof typeof COMPONENT_OPERATORS_MAP || 'default'
    ];
    return operatorOptions.filter(({ value }) => operators.includes(value));
  }

  const filteredOperatorOptions = fieldOperatorOptionsFilter(OPERATOR_OPTIONS, currentOption);

  useEffect(() => {
    if (!filteredOperatorOptions.find(({ value }) => value === condition.op)) {
      onChange({ op: '', value: '' });
    }
  }, [filteredOperatorOptions.length]);

  function handleChange(value: Record<string, string>): void {
    onChange({ value: Object.values(value)[0] });
  }

  const showDateRange = condition.op === 'range';
  const hiddenInput = condition.op === 'null' || condition.op === 'not-null' || showDateRange;
  const dateFormat = currentSchema?.['x-component-props']?.format || 'YYYY-MM-DD';
  let rangePickerDefaultValue: [Moment, Moment] | undefined = undefined;
  if (currentSchema?.['x-component']?.toLowerCase() === 'datepicker' && isArray(condition.value)) {
    rangePickerDefaultValue = condition.value?.map?.((v) => {
      return moment(v);
    }) as unknown as typeof rangePickerDefaultValue;
  }

  return (
    <>
      <Select
        placeholder="选择工作表中的字段"
        value={value}
        onChange={onFieldChange}
        className="h-32 border border-gray-300 corner-2-8-8-8
              px-12 text-12 flex items-center flex-1 mb-8"
        options={options}
      />
      <div
        className={cs(
          'flex flex-row justify-between items-center mb-12 condition-item',
          useCss({
            '.ant-form-item': {
              marginBottom: 0,
            },
          }),
        )}
      >
        <Select
          placeholder="判断符"
          defaultValue={condition.op}
          onChange={(v : Operator) => onChange({ op: v })}
          className={cs(
            'h-32 border border-gray-300 corner-2-8-8-8 px-12 text-12 flex items-center flex-1', {
              'mr-12': !hiddenInput || showDateRange,
            })}
          options={filteredOperatorOptions}
        />
        {!hiddenInput && (
          <>
            {!value ? (
              <input
                className="input"
                defaultValue={condition.value}
                onChange={(e) => onChange({ value: e.target.value })}
              />
            ) : (
              <FormRender
                defaultValue={{ [value]: condition.value }}
                onFormValueChange={handleChange}
                schema={schema}
              />
            )}
          </>
        )}
        {showDateRange && (
          <RangePicker
            {...(currentSchema?.['x-component-props'])}
            format={dateFormat}
            defaultValue={rangePickerDefaultValue}
            onChange={(_, value: string[]) => onChange({ value })}
          />
        )}
      </div>
    </>
  );
}
