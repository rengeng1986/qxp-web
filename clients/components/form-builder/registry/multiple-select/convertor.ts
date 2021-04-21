import { nanoid } from 'nanoid';

export interface MultipleSelectConfig {
  title: string;
  description?: string;
  displayModifier: FormBuilder.DisplayModifier;
  sortable: boolean;
  required: boolean;
  valueSource: FormBuilder.ValueSource;
  availableOptions: Array<{ label: string; value: any; title: string }>,
}
// just for type friendly
export const defaultConfig: MultipleSelectConfig = {
  title: '下拉复选框',
  description: '',
  displayModifier: 'normal',
  sortable: false,
  required: false,
  valueSource: 'customized',
  availableOptions: [
    { label: 'One', value: 'One', title: 'One' },
    { label: 'Two', value: 'Two', title: 'Two' },
    { label: 'Three', value: 'Three', title: 'Three' },
  ],
};

export function toSchema(value: MultipleSelectConfig): FormBuilder.Schema {
  return {
    type: 'array',
    title: value.title,
    description: value.description,
    required: value.required,
    readOnly: value.displayModifier === 'readonly',
    display: value.displayModifier !== 'hidden',
    enum: (value.availableOptions || []).map((option) => {
      return {
        ...option,
        value: nanoid(8),
        title: option.label,
        name: option.label,
      };
    }),
    'x-component': 'Select',
    // todo support optionsLayout
    ['x-component-props']: {
      mode: 'multiple',
    },
    ['x-internal']: {
      sortable: value.sortable,
      permission: 3,
    },
  };
}

export function toConfig(schema: FormBuilder.Schema): MultipleSelectConfig {
  let displayModifier: FormBuilder.DisplayModifier = 'normal';
  if (schema.readOnly) {
    displayModifier = 'readonly';
  } else if (!schema.display) {
    displayModifier = 'hidden';
  }

  return {
    title: schema.title as string,
    description: schema.description as string,
    displayModifier: displayModifier,
    sortable: !!schema['x-internal']?.sortable,
    required: !!schema.required,
    // todo implement this
    valueSource: 'customized',
    // todo refactor this
    availableOptions: schema.enum as Array<{ label: string; value: any; title: string }> || [],
  };
}
