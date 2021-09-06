import React from 'react';
import moment from 'moment';

import SubTable from '@c/form-builder/registry/sub-table/preview';
import AssociatedRecords from '@c/form-builder/registry/associated-records/associated-records';
import AssociatedDataValueRender from '@c/form-builder/registry/associated-data/associated-data-view';
import { RoundMethod } from '@c/form-builder/registry/aggregation-records/convertor';
import logger from '@lib/logger';
import { splitValue } from '@c/form-builder/utils';

type ValueRendererProps = { value: FormDataValue; schema: ISchema; className?: string; };
type Props = {
  value: FormDataValue;
  className?: string;
  schema: ISchema;
}

function datetimeValueRenderer({ value, schema }: ValueRendererProps): string {
  const format = schema['x-component-props']?.format || 'YYYY-MM-DD HH:mm:ss';

  return moment(value as string).format(format);
}

function SubTableValueRenderer({ value, schema }: ValueRendererProps): JSX.Element {
  return (
    // todo support className props, assign to lishengma
    // todo fix subTable Props definition
    <SubTable readonly value={value as Record<string, unknown>[]} schema={schema as any} />
  );
}

function AssociatedRecordsValueRender({ value, schema }: ValueRendererProps): JSX.Element {
  // todo support className props, assign to lishengma
  return (<AssociatedRecords readOnly props={schema} value={value} />);
}

function labelValueRenderer(value: FormDataValue): string {
  if (Array.isArray(value)) {
    const labels = (value as FormBuilder.Option[]).map(({ label }) => label).join(', ');
    return labels;
  }

  return (value as FormBuilder.Option)?.label;
}

function statisticValueRender({ schema, value }: ValueRendererProps): string {
  const { decimalPlaces, roundDecimal, displayFieldNull } = schema['x-component-props'] as {
    decimalPlaces: number, roundDecimal: RoundMethod, displayFieldNull: string
  };
  let method = Math.round;
  if (roundDecimal === 'round-up') {
    method = Math.ceil;
  } else if (roundDecimal === 'round-down') {
    method = Math.floor;
  }
  return method(parseFloat(value as string)).toFixed(decimalPlaces) + '' || displayFieldNull;
}

function objectLabelValueRenderer({ value, schema }: ValueRendererProps): string {
  if (!value) return '';
  const _value = value as string;
  const datasetId = schema['x-component-props']?.datasetId;
  if (datasetId) {
    if (_value.indexOf(':') !== -1) {
      const { label } = splitValue(_value);
      return label;
    }
    return _value;
  }

  if (_value.indexOf(':') !== -1) {
    const { label } = splitValue(_value);
    return label;
  }

  const options = (schema.enum || []) as FormBuilder.Option[];
  return options.find((option) => option.value === _value)?.label ||
    ((_value.indexOf(':') !== -1 ? splitValue(_value).label : _value));
}

function arrayLabelValueRenderer({ value, schema }: ValueRendererProps): string {
  const values: string[] = (value as string[]) || [];
  const datasetId = schema['x-component-props'] && schema['x-component-props'].datasetId;
  if (datasetId) {
    return values.map((option) => {
      return (option.indexOf(':') !== -1) ? splitValue(option).label : option;
    }).join(', ');
  }

  const options = (schema.enum || []) as FormBuilder.Option[];
  return values.map((option) => {
    const _value: string = (option.indexOf(':') !== -1) ? splitValue(option).value : option;
    return options.find((option) => option.value === _value)?.label ||
      (option.indexOf(':') !== -1 ? splitValue(option).label : option);
  }).join(', ');
}

export default function FormDataValueRenderer({ value, schema, className }: Props): JSX.Element {
  if (schema['x-component'] === 'SubTable') {
    return <SubTableValueRenderer schema={schema} value={value} />;
  }

  if (schema['x-component'] === 'AssociatedRecords') {
    return <AssociatedRecordsValueRender schema={schema} value={value} />;
  }

  if (schema['x-component'] === 'AssociatedData') {
    return <AssociatedDataValueRender schema={schema} value={value as LabelValue} />;
  }

  return <span className={className}>{getBasicValue(schema, value)}</span>;
}

export function getBasicValue(schema: ISchema, value: FormDataValue): string {
  switch (schema['x-component']?.toLowerCase()) {
  case 'input':
  case 'numberpicker':
  case 'textarea':
    return value as string;
  case 'radiogroup':
  case 'select':
    return objectLabelValueRenderer({ schema, value });
  case 'checkboxgroup':
  case 'multipleselect':
    return arrayLabelValueRenderer({ schema, value });
  case 'datepicker':
    return datetimeValueRenderer({ schema, value });
  case 'associateddata':
  case 'imageupload':
  case 'cascadeselector':
  case 'fileupload':
  case 'userpicker':
  case 'organizationpicker':
    return labelValueRenderer(value);
  case 'aggregationrecords':
    return statisticValueRender({ schema, value });
  case 'serial':
    return value as string;
  default:
    logger.warn('encounter unsupported formDataValue:', value, 'schema:', schema);
    return value?.toString();
  }
}
