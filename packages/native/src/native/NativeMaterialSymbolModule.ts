/* eslint-disable import-x/no-default-export */

import { type TurboModule, TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {
  getImageSource(
    name: string,
    variant: string | undefined,
    weight: 100 | 200 | 300 | 400 | 500 | 600 | 700 | undefined,
    size: number,
    // Codegen requires using `Object` instead of `object
    // eslint-disable-next-line @typescript-eslint/no-wrapper-object-types
    color: Object
  ): string;
}

export default TurboModuleRegistry.getEnforcing<Spec>(
  'ReactNavigationMaterialSymbolModule'
);
