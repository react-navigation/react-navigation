import { type TurboModule, TurboModuleRegistry } from 'react-native';
import type { EventEmitter } from 'react-native/Libraries/Types/CodegenTypes';

export type EmptyMessage = {};

export type CornersInsets = {
  top: number;
  right: number;
  bottom: number;
  left: number;
};

type CornerInsetsDirection = 'vertical' | 'horizontal';

export interface Spec extends TurboModule {
  cornerInsetsForAdaptivity(direction: CornerInsetsDirection): CornersInsets;
  readonly onCornerInsetsChanged: EventEmitter<EmptyMessage>;
}

export const NativeReactNavigation =
  TurboModuleRegistry.get<Spec>('ReactNavigation');
