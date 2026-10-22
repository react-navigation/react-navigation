import { type TurboModule, TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {
  isSupported(): boolean;
}

export default TurboModuleRegistry.get<Spec>(
  'ReactNavigationLiquidGlassModule'
);
