// just for type friendly
export const defaultConfig = {
  title: '数字',
  description: '',
  displayModifier: '',
  placeholder: '',
  sortable: false,
  precision: 2,
  required: false,
  valueSource: 'customized',
};

type Schema = ISchema & { 'x-internal'?: Record<string, any> };

function toSchema(value: typeof defaultConfig): Schema {
  return {
    title: value.title,
    description: value.description,
    required: value.required,
    readOnly: value.displayModifier === 'readonly',
    display: value.displayModifier !== 'hidden',
    'x-component': 'NumberPicker',
    ['x-component-props']: {
      placeholder: value.placeholder,
      precision: value.precision,
      step: 1 / Math.pow(10, value.precision),
    },
    ['x-internal']: {
      sortable: value.sortable,
    },
  };
}

export default toSchema;
