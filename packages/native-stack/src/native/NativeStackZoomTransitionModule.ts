import { type ColorValue, NativeModules } from 'react-native';

import type { NativeStackZoomTransitionDimmingBlurEffect } from '../types';

type NativeInteractiveDismissValue = 'always' | 'never';

type NativeStackZoomTransitionModule = {
  setRouteConfig: (
    routeKey: string,
    sourceId: string | null,
    targetId: string | null,
    dimmingColor: ColorValue | null,
    dimmingBlurEffect: NativeStackZoomTransitionDimmingBlurEffect | null,
    interactiveDismiss: NativeInteractiveDismissValue | null
  ) => void;
  setPendingSource: (sourceId: string) => void;
  clearRouteConfig: (routeKey: string) => void;
};

const ZoomTransitionModule: NativeStackZoomTransitionModule =
  NativeModules.ReactNavigationNativeStackZoomTransitionModule;

export function setZoomTransitionRouteConfig({
  routeKey,
  sourceId,
  targetId,
  dimmingColor,
  dimmingBlurEffect,
  interactiveDismissEnabled,
}: {
  routeKey: string;
  sourceId?: string;
  targetId?: string;
  dimmingColor?: ColorValue;
  dimmingBlurEffect?: NativeStackZoomTransitionDimmingBlurEffect;
  interactiveDismissEnabled?: boolean;
}) {
  const nativeInteractiveDismiss: NativeInteractiveDismissValue | null =
    interactiveDismissEnabled == null
      ? null
      : interactiveDismissEnabled
        ? 'always'
        : 'never';

  ZoomTransitionModule?.setRouteConfig(
    routeKey,
    sourceId ?? null,
    targetId ?? null,
    dimmingColor ?? null,
    dimmingBlurEffect ?? null,
    nativeInteractiveDismiss
  );
}

export function setZoomTransitionSource(sourceId: string) {
  if (sourceId.length === 0) {
    return;
  }

  ZoomTransitionModule?.setPendingSource(sourceId);
}

export function clearZoomTransitionRouteConfig(routeKey: string) {
  ZoomTransitionModule?.clearRouteConfig(routeKey);
}
