import React, { useEffect, useState } from 'react';
import { clone } from 'ramda';
import { Cascader } from 'antd';
import { useParams } from 'react-router-dom';

import { useGetRequestNodeApiList } from '@portal/modules/poly-api/effects/api/raw';
import {
  useGetNamespaceFullPath,
  useQueryNameSpaceRawRootPath,
} from '@portal/modules/poly-api/effects/api/namespace';
import {
  convertRawApiListToOptions,
  getChildrenOfCurrentSelectOption,
} from '@portal/modules/poly-api/utils/request-node';
import ApiDocDetail from '@polyApi/components/api-doc-detail';
import { observer } from 'mobx-react';

type Props = {
  apiDocDetail: any;
  initRawApiPath: string;
  setApiPath: (apiPath: string) => void;
}

function ApiSelector({ apiDocDetail, setApiPath, initRawApiPath }: Props): JSX.Element {
  const { appID } = useParams<{ appID: string }>();
  const [selectValue, setSelectValue] = useState<any>();
  const [apiNamespacePath, setApiNamespacePath] = useState('');
  const [allApiOptions, setAllApiOptions] = useState<any[]>();
  const [initOption, setIniOption] = useState<string[]>();

  const { data: namespace } = useQueryNameSpaceRawRootPath(appID);
  const { data: namespacePaths } = useGetNamespaceFullPath({
    path: namespace?.appPath?.slice(1) || '',
    body: { active: -1 },
  }, { enabled: !!namespace?.appPath });
  const { data: currentRawApiDetails } = useGetRequestNodeApiList({
    path: apiNamespacePath.slice(1) || '',
    body: { withSub: true, active: -1, page: 1, pageSize: -1 },
  }, { enabled: !!apiNamespacePath });

  function updateApiLeafOptions(option: any): any {
    if (!option) {
      return;
    }

    if (option.path === apiNamespacePath) {
      return {
        ...option,
        children: convertRawApiListToOptions(currentRawApiDetails?.list || []),
        childrenData: currentRawApiDetails?.list,
      };
    } else if (option.children) {
      option.children = option.children.map(updateApiLeafOptions);
    }

    return option;
  }

  function getInitOption(): string[] {
    const rawApiPath = initRawApiPath;
    const test = initRawApiPath.replace(namespace?.appPath || '', '')?.split('/');
    test.shift();
    test.pop();
    namespace?.appPath && test.push(rawApiPath);
    return test;
  }

  useEffect(() => {
    setAllApiOptions(clone(allApiOptions)?.map(updateApiLeafOptions));
  }, [currentRawApiDetails]);

  useEffect(() => {
    initRawApiPath && setIniOption(getInitOption());
  }, []);

  function onChange(value: any, selectedOptions: any): any {
    const leafOption = clone(selectedOptions).pop();
    if (leafOption?.isLeaf) {
      setApiPath(leafOption.path);
      setSelectValue(value);
      return;
    }
    setSelectValue(value);
  }

  function loadData(selectedOptions: any): void {
    const targetOption = selectedOptions[selectedOptions.length - 1];

    targetOption.children = getChildrenOfCurrentSelectOption(targetOption.childrenData) ||
    setApiNamespacePath(targetOption.path);
  }

  useEffect(() => {
    setAllApiOptions(getChildrenOfCurrentSelectOption(namespacePaths?.root.children));
  }, [namespacePaths?.root.children]);

  return (
    <div className="px-20 py-12 flex">
      <div className="poly-api-selector">
        全部API：
        <Cascader
          changeOnSelect
          className="cascader"
          value={selectValue}
          defaultValue={initOption}
          options={allApiOptions}
          loadData={loadData}
          onChange={onChange}
        />
      </div>
      {apiDocDetail && (
        <ApiDocDetail
          className="flex-1"
          method={apiDocDetail.doc.method}
          url={apiDocDetail.doc.url}
          identifier={apiDocDetail.apiPath.split('/').pop()}
        />
      )}
    </div>
  );
}

export default observer(ApiSelector);
