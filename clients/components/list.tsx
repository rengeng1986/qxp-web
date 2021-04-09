import React from 'react';
import { twCascade } from '@mariusmarais/tailwind-cascade';

import { uuid, isFunction, isObject } from '@lib/utils';
import Icon from './icon';

export interface IItem<T> {
  id: string;
  iconName: string;
  text: string;
  onclick?: (params?: T) => void;
}

export type IITems<T> = JSX.Element[] | (() => JSX.Element)[] | IItem<T>[];

export interface IList<T> {
  items: IITems<T>;
  itemClassName?: string;
  className?: string;
  params?: T;
}

export default function List<T extends unknown>({
  className,
  itemClassName,
  items = [],
  params,
}: IList<T>) {
  return (
    <ul className={twCascade('flex flex-col', className)}>
      {items.map((item: JSX.Element | (() => JSX.Element) | IItem<T>) => {
        const isElement = React.isValidElement(item);
        const isFunc = isFunction(item);
        const isObj = isObject(item) && !isElement && !isFunc;
        const curItem = item as IItem<T>;
        if (isObj) {
          return (
            <li
              key={curItem.id}
              onClick={() => {
                curItem.onclick && curItem.onclick(params);
              }}
              className={twCascade(
                'w-full h-36 px-16 flex items-center',
                'cursor-pointer hover:blue-100 transition',
                itemClassName,
              )}
            >
              {
                curItem.iconName && <Icon name={curItem.iconName} size={16} className="mr-8" />
              }
              <div className="text-14 whitespace-nowrap">{curItem.text}</div>
            </li>
          );
        }
        return (
          <li key={uuid()} className={twCascade('transition', itemClassName)}>
            {isFunc && (item as () => JSX.Element)()}
            {isElement && item}
          </li>
        );
      })}
    </ul>
  );
}
