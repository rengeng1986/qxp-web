import { ISchema } from '@formily/react-schema-renderer';

import { deleteOperate, extraOperations } from '../operates';

const schema: ISchema = {
  type: 'object',
  properties: {
    Fields: {
      type: 'object',
      'x-component': 'mega-layout',
      properties: {
        title: {
          type: 'string',
          title: '标题名称',
          default: '单选框',
          required: true,
          // https://github.com/alibaba/formily/issues/1053
          // this bug has not been fix in current release
          // description: '标题名称',
          maxLength: 50,
          'x-rules': {
            required: true,
            message: '请输入标题名称',
          },
          'x-component': 'Input',
          'x-mega-props': {
            labelAlign: 'top',
          },
          'x-index': 0,
        },
        description: {
          type: 'string',
          title: '描述内容',
          maxLength: 50,
          'x-component': 'Input',
          'x-mega-props': {
            labelAlign: 'top',
          },
          'x-index': 2,
        },
        displayModifier: {
          type: 'string',
          title: '字段属性',
          default: 'normal',
          enum: [
            {
              label: '普通',
              value: 'normal',
            },
            {
              label: '只读',
              value: 'readonly',
            },
            {
              label: '隐藏',
              value: 'hidden',
            },
          ],
          'x-component': 'RadioGroup',
          'x-mega-props': {
            labelAlign: 'top',
          },
          'x-index': 3,
        },
        // optionsLayout: {
        //   type: 'string',
        //   title: '排列方式',
        //   default: 'horizontal',
        //   enum: [
        //     {
        //       label: '横向排列',
        //       value: 'horizontal',
        //     },
        //     {
        //       label: '纵向排列',
        //       value: 'vertical',
        //     },
        //   ],
        //   'x-component': 'RadioGroup',
        //   'x-mega-props': {
        //     labelAlign: 'top',
        //   },
        //   'x-index': 4,
        // },
        sortable: {
          title: '列表排序',
          default: false,
          'x-component': 'Switch',
          'x-index': 5,
        },
        required: {
          title: '是否必填',
          default: false,
          'x-component': 'Switch',
          'x-index': 6,
        },
        defaultValueFrom: {
          title: '数值源',
          enum: [
            {
              label: '自定义',
              value: 'customized',
            },
            {
              label: '关联已有数据',
              value: 'linkage',
            },
            {
              label: '通过公式计算',
              value: 'formula',
            },
          ],
          'x-component': 'select',
          'x-mega-props': {
            labelAlign: 'top',
          },
          'x-index': 7,
          'x-linkages': [
            {
              type: 'value:visible',
              target: 'availableOptions',
              condition: '{{ $self.value === "customized" }}',
            },
            {
              type: 'value:visible',
              target: 'defaultValueLinkage',
              condition: '{{ $value === "linkage" }}',
            },
          ],
        },
        linkageConfig: {
          'x-component': 'DefaultValueLinkageConfigBtn',
          'x-index': 8,
        },
        availableOptions: {
          type: 'array',
          'x-component': 'ArrayTable',
          'x-component-props': {
            operationsWidth: 80,
            renderRemove: deleteOperate,
            renderMoveDown: () => null,
            renderMoveUp: () => null,
            renderExtraOperations: extraOperations,
            renderAddition: () => null,
          },
          'x-index': 9,
          items: {
            type: 'object',
            properties: {
              label: {
                type: 'string',
                title: '选项',
                required: true,
                'x-component': 'Input',
                'x-index': 1,
              },
            },
          },
        },
        add: {
          type: 'object',
          'x-component': 'addOperate',
        },
      },
    },
  },
};

export default schema;
