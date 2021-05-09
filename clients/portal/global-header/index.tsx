import React from 'react';
import { useLocation } from 'react-router';

import HeaderNav from './header-nav';
import HeaderMenu from './header-menu';

const paths = [
  '/apps/formDesign',
  '/apps/details',
  '/apps/flow/new',
];

function shouldHideHeader(currentPath: string): boolean {
  return paths.some((path) => currentPath.startsWith(path));
}

export default function GlobalHeader() {
  const { pathname } = useLocation();

  if (shouldHideHeader(pathname)) {
    return null;
  }

  return (
    <>
      <div className="flex justify-between items-center py-8 px-24 bg-white">
        <HeaderNav />
        <img
          className="flex-1 h-46"
          src="/dist/images/quanxiangyun.svg"
          alt="quanxiangyun"
        />
        <HeaderMenu />
      </div>
    </>
  );
}
