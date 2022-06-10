import React from 'react';
import { FountainPackage } from './blocks/fountainhead/type';
import { PropsSpec } from '@one-for-all/node-carve';
import type { NodePrimary } from '@one-for-all/artery-simulator/lib/types';

type nodePropSpecGetter = (node: NodePrimary) => PropsSpec | undefined;

interface FountainCTX {
  getNodePropsSpec: nodePropSpecGetter;
  // fountainPackages: FountainPackage[];
  // key format: packageName:packageVersion:componentName
  // propsSpecDB: Map<string, PropsSpec>;
}

function versionCompatible(newerVersion: string, oldVersion: string): boolean {
  if (newerVersion === oldVersion) {
    return true;
  }

  const newNumList = newerVersion.split('.').map((fragment) => parseInt(fragment));
  const oldNumList = oldVersion.split('.').map((fragment) => parseInt(fragment));

  return newNumList.every((num, index) => num >= oldNumList[index]);
}

function buildPropsSpecDBKey(packageName: string, packageVersion: string, componentName: string): string {
  return `${packageName}:${packageVersion}:${componentName}`;
}

function toPropsSpecDB(fountainPackages: FountainPackage[]): Map<string, PropsSpec> {
  const keyPropsSpecPairs = fountainPackages
    .map(({ pkg: { name, version }, propsSpecMap }) =>
      Object.entries(propsSpecMap)
        .filter((pair): pair is [string, PropsSpec] => !!pair[1])
        .map<[string, PropsSpec]>(([componentName, propSpec]) => [
          buildPropsSpecDBKey(name, version, componentName),
          propSpec,
        ]),
    )
    .reduce<Array<[string, PropsSpec]>>((acc, pairs) => acc.concat(pairs), []);

  return new Map(keyPropsSpecPairs);
}

export function createFountainCTXValue(fountainPackages: FountainPackage[]): FountainCTX {
  const propsSpecDB: Map<string, PropsSpec> = toPropsSpecDB(fountainPackages);
  const packageVersionMap = fountainPackages.reduce<Record<string, string>>((acc, { pkg }) => {
    acc[pkg.name] = pkg.version;
    return acc;
  }, {});

  function getNodePropsSpec(node: NodePrimary): PropsSpec | undefined {
    if (node.type === 'html-element') {
      // todo define html node props as constants
      return;
    }

    const latestPackageVersion = packageVersionMap[node.packageName];
    if (!latestPackageVersion) {
      return;
    }

    if (versionCompatible(latestPackageVersion, node.packageVersion)) {
      return propsSpecDB.get(buildPropsSpecDBKey(node.packageName, latestPackageVersion, node.exportName));
    }

    return;
  }

  return { getNodePropsSpec };
}

const FountainContext = React.createContext<FountainCTX>({ getNodePropsSpec: () => undefined });

export default FountainContext;
