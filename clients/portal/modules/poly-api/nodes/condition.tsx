import React from 'react';
import { NodeProps } from 'react-flow-renderer';

import useObservable from '@lib/hooks/use-observable';
import Icon from '@c/icon';

import NodeWrapper from './wrapper';
import useNodeConfig from '../effects/hooks/use-node-config';
import conditionConfigSchema from './forms/condition-config-schema';

export default function ConditionNode(props: NodeProps<POLY_API.SubjectPolyNode>): JSX.Element | null {
  const [isConfigShow, setIsConfigShow] = React.useState(false);
  const nodeData = useObservable<POLY_API.PolyNode>(props.data);

  useNodeConfig({
    visible: isConfigShow,
    currentNode: props.data,
    schema: conditionConfigSchema,
    onClose: () => setIsConfigShow(false),
    excludedFields: ['apiDoc'],
  });

  function showConfig(): void {
    setIsConfigShow(true);
  }

  if (nodeData.type !== 'if') {
    return null;
  }

  return (
    <NodeWrapper
      noPadding
      noBg
      {...props}
    >
      <Icon
        onClick={showConfig}
        name="condition"
        size={50}
        className="poly-condition"
        style={{ backgroundColor: 'transparent' }}
      />
    </NodeWrapper>
  );
}
