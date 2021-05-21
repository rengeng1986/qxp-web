import React, { useRef, useState, useContext } from 'react';
import moment from 'moment';
import { observer } from 'mobx-react';

import Button from '@c/button';
import Icon from '@c/icon';

import FiltrateForm from './filtrate-form';
import { StoreContext } from './context';

function PageDataFiltrate() {
  const [showMoreFiltrate, setShowMoreFiltrate] = useState(false);
  const store = useContext(StoreContext);
  const { filtrates } = store;
  const filterDom = useRef<any>();

  const search = () => {
    if (!store.allowRequestData) {
      return;
    }

    const condition: Condition[] = [];
    const values = filterDom.current.getValues();
    Object.keys(values).forEach((key) => {
      const curFiltrate = store.filtrates.find(({ id }) => id === key);
      if (!values[key] || (Array.isArray(values[key]) && values[key].length === 0)) {
        return;
      }

      const _condition: Condition = { key };
      switch (curFiltrate?.type) {
      case 'date_range':
        const { start, end } = values[key];
        if (!values[key].readableCode) {
          return;
        }

        _condition.value = [moment(start).format(), moment(end).format()];
        _condition.op = 'between';
        break;
      case 'date':
        _condition.value = [moment(values[key]).format()];
        _condition.op = 'eq';
        break;
      case 'number':
        _condition.value = [Number(values[key])];
        _condition.op = curFiltrate.compareSymbol;
        break;
      default:
        if (Array.isArray(values[key])) {
          _condition.op = 'in';
          _condition.value = values[key];
        } else {
          _condition.op = 'like';
          _condition.value = [values[key]];
        }
        break;
      }

      condition.push(_condition);
    });

    store.setParams({ condition });
  };

  const reset = () => {
    const resObj: any = {};
    filtrates.map(({ id }) => {
      resObj[id] = '';
    });
    filterDom.current.reset(resObj);
  };

  const noFilter = filtrates.length === 0;

  return (
    <div className='form-app-data-table-container form-app-data-table-filtrate'>
      <FiltrateForm ref={filterDom} filtrates={filtrates} showMoreFiltrate={showMoreFiltrate} />
      <div>
        {filtrates.length > 3 ? (
          <span
            onClick={() => setShowMoreFiltrate(!showMoreFiltrate)}
            className='form-app-data-table-filtrate-more'
          >
            {showMoreFiltrate ? '收起' : '展开'}全部
            <Icon
              size={16}
              className='ml-4 app-icon-color-inherit'
              name={showMoreFiltrate ? 'expand_less' : 'expand_more'}
            />
          </span>
        ) : null}
        <Button forbidden={noFilter} onClick={search} className='mr-16' modifier='primary'>
          查询
        </Button>
        <Button forbidden={noFilter} onClick={reset}>重置</Button>
      </div>
    </div>
  );
}

export default observer(PageDataFiltrate);
