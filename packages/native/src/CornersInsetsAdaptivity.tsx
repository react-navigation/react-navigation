import { useSyncExternalStoreWithSelector } from 'use-sync-external-store/with-selector';

import {
  NativeReactNavigation,
  zeroInsets,
} from './native-module/NativeReactNavigation';
import type { SafeAreaInsets } from './native-module/NativeReactNavigationImpl';

function getHorizontalSafeAreaFromNative() {
  return (
    NativeReactNavigation?.cornersInsetsForHorizontalAdaptivity?.() ??
    zeroInsets
  );
}

function getVerticalSafeAreaFromNative() {
  return (
    NativeReactNavigation?.cornersInsetsForVerticalAdaptivity?.() ?? zeroInsets
  );
}

function areSafeAreaInsetsEqual(a: SafeAreaInsets, b: SafeAreaInsets): boolean {
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

function useCornersInsets(getSnapshot: () => SafeAreaInsets) {
  return useSyncExternalStoreWithSelector(
    subscribeToCornersInsetsChanges,
    getSnapshot,
    getSnapshot,
    (s) => s,
    areSafeAreaInsetsEqual
  );
}

export function useCornersInsetsForHorizontalAdaptivity() {
  return useCornersInsets(getHorizontalSafeAreaFromNative);
}

export function useCornersInsetsForVerticalAdaptivity() {
  return useCornersInsets(getVerticalSafeAreaFromNative);
}
