import React, { useEffect } from 'react';
import { useParams } from 'react-router';

import store from './store';
import DocumentNav from './document-nav';
import ApiDocumentDetails from './document-detalis';

import './index.scss';

function ApiDocument(): JSX.Element {
  const { appID } = useParams<AppParams>();

  useEffect(() => {
    store.appID = appID;
    store.fetchDataModels();
    return () => {
      store.tableID = '';
    };
  }, [appID]);

  return (
    <div className="flex h-full">
      <DocumentNav/>
      <ApiDocumentDetails />
    </div>
  );
}

export default ApiDocument;
