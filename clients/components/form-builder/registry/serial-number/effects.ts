import { createFormActions, FormEffectHooks } from '@formily/antd';
import moment from 'moment';
import { PrefixType } from './convertor';
import { Format } from './prefix';

type PreviewProps = {
  prefix: PrefixType,
  initialPosition: number,
  initialValue: number,
  suffix: string,
}

const { onFieldValueChange$ } = FormEffectHooks;

const addZeroFromValue = (position: number, value: number): string => {
  return (Array(position).join('0') + value?.toString()).slice(-position);
};

const getMoment = (value: Format | ''): string => {
  switch (value) {
    case '':
      return '';
    case 'yyyy':
      return moment().format('YYYY');
    case 'yyyyMM':
      return moment().format('YYYYMM');
    case 'yyyyMMdd':
      return moment().format('YYYYMMDD');
    case 'yyyyMMddHHmm':
      return moment().format('YYYYMMDDhhmm');
    case 'yyyyMMddHHmmss':
      return moment().format('YYYYMMDDhhmmss');
  }
};

const getPreview = ({ prefix, initialPosition, initialValue, suffix }: PreviewProps): string => {
  return prefix.frontward + getMoment(prefix.backward) +
    addZeroFromValue(initialPosition, initialValue) + suffix;
};

export default function effects(): void {
  const { setFieldState, getFieldValue } = createFormActions();

  onFieldValueChange$('*(prefix, initialPosition, initialValue, suffix)').subscribe(() => {
    setFieldState('numberPreview', (state) => {
      const prefix = getFieldValue('prefix');
      const suffix = getFieldValue('suffix');
      const initialPosition = getFieldValue('initialPosition');
      const initialValue = getFieldValue('initialValue');
      state.value = getPreview({ prefix, initialPosition, initialValue, suffix });
    });
  });
}
