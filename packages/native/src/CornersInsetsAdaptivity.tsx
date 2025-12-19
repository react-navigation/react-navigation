import type { Insets } from 'react-native';
import { useSyncExternalStoreWithSelector } from 'use-sync-external-store/with-selector';

import { NativeReactNavigation } from './native-module/NativeReactNavigation';

function getHorizontalCornersInsetsFromNative() {
  return NativeReactNavigation?.cornersInsetsForHorizontalAdaptivity?.() ?? {};
}

function getVerticalCornersInsetsFromNative() {
  return NativeReactNavigation?.cornersInsetsForVerticalAdaptivity?.() ?? {};
}

function areInsetsEqual(a: Insets, b: Insets): boolean {
  return (
    a.top === b.top &&
    a.right === b.right &&
    a.bottom === b.bottom &&
    a.left === b.left
  );
}

function subscribeToCornersInsetsChanges(listener: () => void) {
  return (
    NativeReactNavigation?.onCornersInsetsChanged?.(() => {
      console.log('Safe area layout changed from native');
      listener();
    }).remove ?? (() => {})
  );
}

function useCornersInsets(getSnapshot: () => Insets) {
  return useSyncExternalStoreWithSelector(
    subscribeToCornersInsetsChanges,
    getSnapshot,
    getSnapshot,
    (s) => s,
    areInsetsEqual
  );
}

export function useCornersInsetsForHorizontalAdaptivity() {
  return useCornersInsets(getHorizontalCornersInsetsFromNative);
}

export function useCornersInsetsForVerticalAdaptivity() {
  return useCornersInsets(getVerticalCornersInsetsFromNative);
}
