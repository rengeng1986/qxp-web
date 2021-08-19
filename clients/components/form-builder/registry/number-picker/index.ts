import { NumberPicker } from '@formily/antd-components';

import { validateRegistryElement } from '@c/form-builder/utils';

import configSchema from './config-schema';
import { defaultConfig, toSchema, toConfig, NumberPickerConfig } from './convertor';

const NumberPickerField: Omit<FormBuilder.SourceElement<NumberPickerConfig>, 'displayOrder'> = {
  configSchema,
  toConfig,
  displayName: '数字',
  icon: 'plus_one',
  defaultConfig: defaultConfig,
  toSchema,
  component: NumberPicker,
  category: 'basic',
  componentName: 'NumberPicker',
  compareOperators: ['==', '!=', '>', '>=', '<=', '<'],
  validate: validateRegistryElement(configSchema),
};

export default NumberPickerField;
