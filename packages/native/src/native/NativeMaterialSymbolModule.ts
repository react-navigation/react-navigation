/* eslint-disable import-x/no-default-export */

import { type TurboModule, TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {
  getImageSource(
    name: string,
    variant: string,
    size: number,
    weight: 100 | 200 | 300 | 400 | 500 | 600 | 700,
    // Codegen requires using `Object` instead of `object
    // eslint-disable-next-line @typescript-eslint/no-wrapper-object-types
    color: Object,
    hash: string
  ): string;
}

export default TurboModuleRegistry.getEnforcing<Spec>(
  'ReactNavigationMaterialSymbolModule'
);
