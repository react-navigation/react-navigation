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
  cornersInsetsForVerticalAdaptivity(): SafeAreaInsets;
  cornersInsetsForHorizontalAdaptivity(): SafeAreaInsets;
  readonly onCornersInsetsChanged: EventEmitter<EmptyMessage>;
}

export const NativeReactNavigation =
  TurboModuleRegistry.get<Spec>('ReactNavigation');
