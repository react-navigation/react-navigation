import { type TurboModule, TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {
  isFullScreen(): boolean;
}

export const NativeReactNavigation =
  TurboModuleRegistry.get<Spec>('ReactNavigation');
