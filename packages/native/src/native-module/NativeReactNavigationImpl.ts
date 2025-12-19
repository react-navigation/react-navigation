import { type TurboModule, TurboModuleRegistry } from 'react-native';

export type SafeAreaInsets = {
  top: number;
  right: number;
  bottom: number;
  left: number;
};

export interface Spec extends TurboModule {
  isFullScreen(): boolean;
  safeAreaLayoutForVerticalAdaptivity(): SafeAreaInsets;
  safeAreaLayoutForHorizontalAdaptivity(): SafeAreaInsets;
}

export const NativeReactNavigation =
  TurboModuleRegistry.get<Spec>('ReactNavigation');
