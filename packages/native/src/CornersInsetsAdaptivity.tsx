import type { Insets } from 'react-native';
import { useSyncExternalStoreWithSelector } from 'use-sync-external-store/with-selector';

import { NativeReactNavigation } from './native-module/NativeReactNavigation';

export type CornerInsetsDirection = 'vertical' | 'horizontal';

function getCornerInsetsFromNative(direction: CornerInsetsDirection) {
  return NativeReactNavigation?.cornerInsetsForAdaptivity?.(direction) ?? {};
}

function areInsetsEqual(a: Insets, b: Insets): boolean {
  return (
    a.top === b.top &&
    a.right === b.right &&
    a.bottom === b.bottom &&
    a.left === b.left
  );
}

function subscribeToCornerInsetsChanges(listener: () => void) {
  return (
    NativeReactNavigation?.onCornerInsetsChanged?.(() => {
      listener();
    }).remove ?? (() => {})
  );
}

function useCornerInsetsWithSnapshot(getSnapshot: () => Insets) {
  return useSyncExternalStoreWithSelector(
    subscribeToCornerInsetsChanges,
    getSnapshot,
    getSnapshot,
    (s) => s,
    areInsetsEqual
  );
}

export function useCornerInsets(direction: CornerInsetsDirection) {
  return useCornerInsetsWithSnapshot(() =>
    getCornerInsetsFromNative(direction)
  );
}
