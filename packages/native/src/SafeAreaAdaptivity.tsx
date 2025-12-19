import { useSyncExternalStoreWithSelector } from 'use-sync-external-store/with-selector';

import { NativeReactNavigation } from './native-module/NativeReactNavigation';
import type { SafeAreaInsets } from './native-module/NativeReactNavigationImpl';

const zeroInsets: SafeAreaInsets = {
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
};

function getHorizontalSafeAreaFromNative() {
  return (
    NativeReactNavigation?.safeAreaLayoutForHorizontalAdaptivity?.() ??
    zeroInsets
  );
}

function getVerticalSafeAreaFromNative() {
  return (
    NativeReactNavigation?.safeAreaLayoutForVerticalAdaptivity?.() ?? zeroInsets
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

function subscribeToSafeAreaLayoutChanges(listener: () => void) {
  return NativeReactNavigation?.onSafeAreaLayoutChanged?.(() => {
    console.log('Safe area layout changed from native');
    listener();
  }).remove;
}

function useSafeAreaLayout(getSnapshot: () => SafeAreaInsets) {
  return useSyncExternalStoreWithSelector(
    subscribeToSafeAreaLayoutChanges,
    getSnapshot,
    getSnapshot,
    (s) => s,
    areSafeAreaInsetsEqual
  );
}

export function useSafeAreaLayoutForHorizontalAdaptivity() {
  return useSafeAreaLayout(getHorizontalSafeAreaFromNative);
}

export function useSafeAreaLayoutForVerticalAdaptivity() {
  return useSafeAreaLayout(getVerticalSafeAreaFromNative);
}
