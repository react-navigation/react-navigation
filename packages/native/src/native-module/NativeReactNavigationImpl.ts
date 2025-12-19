import { type TurboModule, TurboModuleRegistry } from 'react-native';
import type { EventEmitter } from 'react-native/Libraries/Types/CodegenTypes';

export type EmptyMessage = {};

export type SafeAreaInsets = {
  top: number;
  right: number;
  bottom: number;
  left: number;
};

export interface Spec extends TurboModule {
  safeAreaLayoutForVerticalAdaptivity(): SafeAreaInsets;
  safeAreaLayoutForHorizontalAdaptivity(): SafeAreaInsets;
  readonly onSafeAreaLayoutChanged: EventEmitter<EmptyMessage>;
}

export const NativeReactNavigation =
  TurboModuleRegistry.get<Spec>('ReactNavigation');
