import React from 'react';

import SideNav from '../side-nav';
import Content from '../comps/content';

interface Props {
  className?: string;
}

function Detail(props: Props) {
  return (
    <>
      <SideNav/>
      <Content>
        api detail
      </Content>
    </>
  );
}

export default Detail;
