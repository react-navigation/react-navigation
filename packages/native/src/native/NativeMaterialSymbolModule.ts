/* eslint-disable import-x/no-default-export */

import { type TurboModule, TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {
  getImageSource(
    name: string,
    variant: string,
    size: number,
    // Codegen requires using `Object` instead of `object
    // eslint-disable-next-line @typescript-eslint/no-wrapper-object-types
    color: Object,
    hash: string
  ): string;
}

export default TurboModuleRegistry.getEnforcing<Spec>(
  'ReactNavigationMaterialSymbolModule'
);
