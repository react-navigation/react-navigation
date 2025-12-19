import { type TurboModule, TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {
  isFullScreen(): boolean;
}

export const IsFullScreen =
  TurboModuleRegistry.getEnforcing<Spec>('IsFullScreen');
