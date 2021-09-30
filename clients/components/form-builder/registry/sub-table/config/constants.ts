import { JSXElementConstructor } from 'react';
import { ISchemaFieldComponentProps } from '@formily/antd';
import {
  Input,
  Select,
  Switch,
  ArrayTable,
  NumberPicker,
  DatePicker,
  Radio,
} from '@formily/antd-components';

import InputForLabels from '@c/form-builder/form-settings-panel/form-field-config/input-for-labels';
import DatasetConfig from '@c/form-builder/form-settings-panel/form-field-config/dataset-config';
import input from '@c/form-builder/registry/input';
import textarea from '@c/form-builder/registry/textarea';
import radiogroup from '@c/form-builder/registry/radio-group';
import checkboxgroup from '@c/form-builder/registry/checkbox-group';
import numberpicker from '@c/form-builder/registry/number-picker';
import datepicker from '@c/form-builder/registry/date-picker';
import select from '@c/form-builder/registry/select';
import multipleselect from '@c/form-builder/registry/multiple-select';
import userpicker from '@c/form-builder/registry/user-picker';
import organizationpicker from '@c/form-builder/registry/organization-select';
import fileupload from '@c/form-builder/registry/file-upload';
import imageupload from '@c/form-builder/registry/image-upload';
import cascadeselector from '@c/form-builder/registry/cascade-selector';
import associateddata from '@c/form-builder/registry/associated-data';
import DefaultValueLinkageConfigBtn from
  '@c/form-builder/form-settings-panel/form-field-config/default-value-linkage-config-btn';
import CalculationFormulaBtn
  from '@c/form-builder/form-settings-panel/form-field-config/calculation-formula-btn';

import * as inputConvertor from '@c/form-builder/registry/input/convertor';
import * as textareaConvertor from '@c/form-builder/registry/textarea/convertor';
import * as numberConvertor from '@c/form-builder/registry/number-picker/convertor';
import * as datetimeConvertor from '@c/form-builder/registry/date-picker/convertor';
import * as selectorConvertor from '@c/form-builder/registry/select/convertor';
import * as radioConvertor from '@c/form-builder/registry/radio-group/convertor';
import * as checkboxConvertor from '@c/form-builder/registry/checkbox-group/convertor';
import * as userPickerConvertor from '@c/form-builder/registry/user-picker/convertor';
import * as organizationPickerConvertor from '@c/form-builder/registry/organization-select/convertor';
import * as fileUploadConvertor from '@c/form-builder/registry/file-upload/convertor';
import * as imageUploadConvertor from '@c/form-builder/registry/image-upload/convertor';
import * as cascadeSelectorConvertor from '@c/form-builder/registry/cascade-selector/convertor';
import * as associatedDataConvertor from '@c/form-builder/registry/associated-data/convertor';
import * as multipleSelectorConvertor
  from '@c/form-builder/registry/multiple-select/convertor';

import SubTableSchema from './fields/sub-table-schema';
import SubTableColumns from './fields/sub-table-columns';
import Subordination from './fields/subordination';
import LinkedTable from './fields/linked-table';
import { AddOperate } from './fields/operates';
import CustomizedDatasetBtn from '../../cascade-selector/customized-dataset-btn';
import DataSetSelector from '../../cascade-selector/dataset-selector';
import CheckboxGroup from '../../checkbox-group/checkboxGroup';

export const COMPONENTS: Record<string, JSXElementConstructor<ISchemaFieldComponentProps>> = {
  textarea: Input.TextArea,
  subordination: Subordination,
  input: Input,
  select: Select,
  subtableschema: SubTableSchema,
  subtablecolumns: SubTableColumns,
  linkedtable: LinkedTable,
  switch: Switch,
  // todo delete this
  arraytable: ArrayTable,
  inputforlabels: InputForLabels,
  addoperate: AddOperate,
  numberpicker: NumberPicker,
  datepicker: DatePicker,
  defaultvaluelinkageconfigbtn: DefaultValueLinkageConfigBtn,
  radiogroup: Radio.Group,
  customizeddatasetbtn: CustomizedDatasetBtn,
  datasetselector: DataSetSelector,
  datasetconfig: DatasetConfig,
  checkboxgroup: CheckboxGroup,
  calculationformulabtn: CalculationFormulaBtn,
};

export type KeyOfConfigComponent = keyof typeof CONFIG_COMPONENTS;

export const CONFIG_COMPONENTS = {
  input,
  textarea,
  radiogroup,
  checkboxgroup,
  numberpicker,
  datepicker,
  select,
  multipleselect,
  userpicker,
  organizationpicker,
  fileupload,
  imageupload,
  cascadeselector,
  associateddata,
};

export const SUPPORTED_COMPONENTS_NAMES = [
  'input', 'textarea',
  'radiogroup', 'checkboxgroup',
  'numberpicker', 'datepicker',
  'select', 'multipleselect',
  'userpicker', 'organizationpicker',
  'fileupload', 'imageupload',
  'cascadeselector', 'associateddata', 'serial',
];

export const LINKED_TABLE = { appID: '', tableID: '', tableName: '' };

export const SUB_TABLE_TYPES_SCHEMA_MAP: Record<string, ISchema> = {
  id: {
    display: false,
    readOnly: false,
    title: 'id',
    type: 'string',
    'x-component': 'Input',
    'x-component-props': {},
    'x-index': -1,
    'x-internal': { isSystem: true, permission: 3 },
    'x-mega-props': { labelCol: 4 },
  },
  input: inputConvertor.toSchema(inputConvertor.defaultConfig),
  textarea: textareaConvertor.toSchema(textareaConvertor.defaultConfig),
  radiogroup: radioConvertor.toSchema(radioConvertor.defaultConfig),
  checkboxgroup: checkboxConvertor.toSchema(checkboxConvertor.defaultConfig),
  numberpicker: numberConvertor.toSchema(numberConvertor.defaultConfig),
  datepicker: datetimeConvertor.toSchema(datetimeConvertor.defaultConfig),
  select: selectorConvertor.toSchema(selectorConvertor.defaultConfig),
  multipleselect: multipleSelectorConvertor.toSchema(multipleSelectorConvertor.defaultConfig),
  userpicker: userPickerConvertor.toSchema(userPickerConvertor.defaultConfig),
  organizationpicker: organizationPickerConvertor.toSchema(organizationPickerConvertor.defaultConfig),
  fileupload: fileUploadConvertor.toSchema(fileUploadConvertor.defaultConfig),
  imageupload: imageUploadConvertor.toSchema(imageUploadConvertor.defaultConfig),
  cascadeselector: cascadeSelectorConvertor.toSchema(cascadeSelectorConvertor.defaultConfig),
  associateddata: associatedDataConvertor.toSchema(associatedDataConvertor.defaultConfig),
};

export const SUB_TABLE_TYPES = [
  { label: '单行文本', value: 'input' },
  { label: '多行文本', value: 'textarea' },
  { label: '单选框', value: 'radiogroup' },
  { label: '复选框', value: 'checkboxgroup' },
  { label: '数字', value: 'numberpicker' },
  { label: '日期时间', value: 'datepicker' },
  { label: '下拉单选框', value: 'select' },
  { label: '下拉复选框', value: 'multipleselect' },
  { label: '人员选择', value: 'userpicker' },
  { label: '部门选择', value: 'organizationpicker' },
  { label: '附件', value: 'fileupload' },
  { label: '图片', value: 'imageupload' },
  { label: '级联选择', value: 'cascadeselector' },
  { label: '关联数据', value: 'associateddata' },
];
