import React from 'react';

import Icon from '@c/icon';

type Props = {
  configs?: any,
}

function ApiParamsConfig({ configs }: Props): JSX.Element {
  const polyParams = Object.entries(configs);

  return (
    <div className="p-12 flex-2 bg-gray-50 overflow-auto config-params-container">
      {polyParams?.length && polyParams.map(([type, params]: any) => {
        return (
          <div key={type} className="my-20">
            <div className="pb-4 text-gray-900">{type.replace(/^\S/, (s: string) => s.toUpperCase())}</div>
            <div className="config-param">
              {params.map(({ title, name, required }: any, index: number) => {
                return (
                  <div key={`${title}_${name}_${index}`} className="flex justify-between">
                    <div className="flex items-center justify-between w-142 p-8 flex-1">
                      <div className="flex-1 truncate">
                        <span>{title}</span>
                        <span className="mx-4 text-gray-400">{name}</span>
                        {required && <span className="text-red-600">*</span>}
                      </div>
                      <Icon className="ml-8" name="arrow_left_alt" />
                    </div>
                    <div className="flex-2 border-l-1 border-gray-200 p-8">
                      {/* <FormulaEditor help="" maxLength={undefined} /> */}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default ApiParamsConfig;
