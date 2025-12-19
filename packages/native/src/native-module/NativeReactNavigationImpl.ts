import { type TurboModule, TurboModuleRegistry } from 'react-native';
import type { EventEmitter } from 'react-native/Libraries/Types/CodegenTypes';

export type EmptyMessage = {};

export type CornersInsets = {
  top: number;
  right: number;
  bottom: number;
  left: number;
};

export interface Spec extends TurboModule {
  cornersInsetsForVerticalAdaptivity(): CornersInsets;
  cornersInsetsForHorizontalAdaptivity(): CornersInsets;
  readonly onCornersInsetsChanged: EventEmitter<EmptyMessage>;
}

export const NativeReactNavigation =
  TurboModuleRegistry.get<Spec>('ReactNavigation');
