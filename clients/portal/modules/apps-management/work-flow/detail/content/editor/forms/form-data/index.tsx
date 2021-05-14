import React, { FormEvent, useState, useEffect } from 'react';
import cs from 'classnames';
import { useQuery } from 'react-query';
import { isEqual } from 'lodash';
import { useParams } from 'react-router-dom';

import Drawer from '@c/drawer';
import toast from '@lib/toast';
import useObservable from '@lib/hooks/use-observable';
import Tab from '@c/tab';
import store, {
  StoreValue,
  CurrentElement,
  updateStore,
  FormDataData,
  TriggerWay as TriggerWayType,
  TriggerCondition as TriggerConditionType,
  updateDataField,
  Errors,
} from '@flow/detail/content/editor/store';
import SaveButtonGroup
  from '@flow/detail/content/editor/components/_common/action-save-button-group';

import TriggerWay from './basic-config/trigger-way';
import FormSelector from '../form-selector';
import TriggerCondition from './basic-config/trigger-condition';
import { getFormFieldOptions } from '../api';

export default function FormDataForm() {
  const { appID } = useParams<{ appID: string }>();
  const { asideDrawerType, elements = [], errors } = useObservable<StoreValue>(store) || {};
  const currentElement = elements.find(({ id }) => id === asideDrawerType) as CurrentElement;
  const [formData, setFormData] = useState<FormDataData>(currentElement?.data?.businessData);
  const { data: formFieldOptions = [], isError } = useQuery(
    ['GET_WORK_FORM_FIELD_LIST', formData?.form?.value, appID],
    getFormFieldOptions, {
      enabled: !!formData?.form?.value,
    }
  );

  isError && toast.error('获取工作表字段列表失败');

  useEffect(() => {
    if (currentElement?.data?.businessData) {
      setFormData(currentElement.data.businessData);
    }
  }, [currentElement?.data?.businessData]);

  useEffect(() => {
    if (!currentElement?.data?.businessData || !formData) {
      return;
    }
    if (!isEqual(currentElement?.data?.businessData, formData)) {
      updateStore<Errors>('errors', (err) => {
        err.dataNotSaveMap.set(currentElement.id, true);
        return { ...err };
      });
    } else {
      updateStore<Errors>('errors', (err) => {
        err.dataNotSaveMap.delete(currentElement.id);
        return { ...err };
      });
    }
  }, [currentElement?.data?.businessData, formData]);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    updateDataField(currentElement.id, null, () => formData);
  }

  function onFormChange(value: { value: string; name: string; }) {
    setFormData((s) => ({ ...s, form: { ...value } }));
  }

  function onTriggerWayChange(value: { triggerWay?: TriggerWayType, whenAlterFields?: string[]; }) {
    setFormData((s) => ({ ...s, ...value }));
  }

  function onTriggerConditionChange(triggerCondition: TriggerConditionType) {
    setFormData((s) => ({ ...s, triggerCondition }));
  }

  function closePanel() {
    updateStore<StoreValue>(null, (s) => {
      s.errors.dataNotSaveMap.delete(currentElement?.id);
      return {
        ...s,
        asideDrawerType: '',
        errors: s.errors,
      };
    });
  }

  function onCancel() {
    if (errors?.dataNotSaveMap?.get(currentElement?.id)) {
      updateStore<StoreValue>(null, (s) => ({
        ...s,
        showDataNotSaveConfirm: true,
        currentDataNotSaveConfirmCallback: () => closePanel(),
      }));
      return false;
    } else {
      updateStore<StoreValue>(null, (s) => ({ ...s, asideDrawerType: '' }));
    }
  }

  function onLeave() {
    if (errors?.dataNotSaveMap?.get(currentElement?.id)) {
      closePanel();
    } else {
      updateStore<StoreValue>(null, (s) => ({ ...s, asideDrawerType: '' }));
    }
  }

  if (!currentElement || !formData?.form) {
    return null;
  }

  return (
    <>
      {currentElement.type === 'formData' && (
        <Drawer
          title={(
            <span className="text-h5 mr-8">工作表触发</span>
          )}
          distanceTop={0}
          onCancel={onCancel}
          className="flow-editor-drawer"
        >
          <form
            onSubmit={onSubmit}
            className="flex-1 flex flex-col justify-between h-full"
          >
            <div className="flex-1" style={{ height: 'calc(100% - 56px)' }}>
              <FormSelector
                value={formData?.form?.value}
                onChange={onFormChange}
              />
              <Tab
                className="mt-10"
                headerClassName="border-gray-200 border-b-1"
                titleClassName={cs(
                  'bg-white hover:bg-white',
                  'hover:border-blue-600 hover:border-b-4'
                )}
                activeTitleClassName="border-blue-600 border-b-4"
                contentClassName="overflow-scroll bg-white"
                style={{ height: 'calc(100% - 56px)' }}
                items={[{
                  id: 'basicConfig',
                  name: '基础配置',
                  content: (
                    <div className="mt-24">
                      <TriggerWay
                        formFieldOptions={formFieldOptions}
                        triggerWayValue={{
                          triggerWay: formData.triggerWay,
                          whenAlterFields: formData.whenAlterFields,
                        }}
                        onValueChange={onTriggerWayChange}
                      />
                      <TriggerCondition
                        formFieldOptions={formFieldOptions}
                        value={formData.triggerCondition}
                        onChange={onTriggerConditionChange}
                      />
                    </div>
                  ),
                }]}
              />
            </div>
            <SaveButtonGroup onCancel={onLeave} />
          </form>
        </Drawer>
      )}
    </>
  );
}
