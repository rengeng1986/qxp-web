import React, { useRef, useState, useContext } from 'react';
import moment from 'moment';
import { observer } from 'mobx-react';

import Button from '@c/button';
import Icon from '@c/icon';

import FilterForm from './filter-form';
import { StoreContext } from './context';

function PageDataFilter(): JSX.Element | null {
  const [showMoreFilter, setShowMoreFilter] = useState(false);
  const store = useContext(StoreContext);
  const filterKeys = Object.keys(store.filters);

  const filterDom = useRef<any>();

  const search = (): void => {
    if (!store.allowRequestData) {
      return;
    }

    const condition: Condition[] = [];
    const values = filterDom.current.getValues();
    Object.keys(values).forEach((key) => {
      const curFilter = store.fields.find(({ id }) => id === key);
      if (!values[key] || (Array.isArray(values[key]) && values[key].length === 0) || !curFilter) {
        return;
      }

      const _condition: Condition = { key };
      switch (curFilter?.type) {
      case 'datetime': {
        const [start, end] = values[key];
        const format = curFilter?.['x-component-props']?.format;
        if (format) {
          _condition.value = [
            moment(start.format(format)).toISOString(),
            moment(end.format(format)).toISOString(),
          ];
        } else {
          _condition.value = [
            moment(start).format('YYYY-MM-DDT00:00:00'),
            moment(end).format('YYYY-MM-DDT24:00:00'),
          ];
        }

        _condition.op = 'between';
        break;
      }
      case 'number':
        _condition.value = [Number(values[key])];
        _condition.op = 'eq';
        break;
      case 'array':
        _condition.value = values[key];
        _condition.op = 'fullSubset';
        break;
      default:
        if (Array.isArray(values[key])) {
          _condition.value = values[key];
          _condition.op = 'intersection';
        } else {
          _condition.value = [values[key]];
          _condition.op = 'like';
        }
        break;
      }

      condition.push(_condition);
    });
    store.filterData = values;
    store.setParams({ condition });
  };

  const reset = (): void => {
    const resObj: Record<string, ''> = {};
    filterKeys.map((id) => {
      resObj[id] = '';
    });
    filterDom.current.reset(resObj);
  };

  const noFilter = filterKeys.length === 0;

  if (noFilter) {
    return null;
  }

  return (
    <div className='form-app-data-table-container form-app-data-table-filter'>
      <FilterForm search={search} ref={filterDom} showMoreFilter={showMoreFilter} />
      <div>
        {filterKeys.length > 3 ? (
          <span
            onClick={() => setShowMoreFilter(!showMoreFilter)}
            className='form-app-data-table-filter-more'
          >
            {showMoreFilter ? '收起' : '展开'}全部
            <Icon
              size={16}
              className='ml-4 app-icon-color-inherit'
              name={showMoreFilter ? 'expand_less' : 'expand_more'}
            />
          </span>
        ) : null}
        <Button onClick={search} className='mr-16' modifier='primary'>
          查询
        </Button>
        <Button onClick={reset}>重置</Button>
      </div>
    </div>
  );
}

export default observer(PageDataFilter);
