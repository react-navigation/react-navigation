import { type ColorValue, NativeModules } from 'react-native';

import type { NativeStackZoomTransitionDimmingBlurEffect } from '../types';

type NativeStackZoomTransitionModule = {
  setRouteConfig: (
    routeKey: string,
    sourceId: string | null,
    targetId: string | null,
    dimmingColor: ColorValue | null,
    dimmingBlurEffect: NativeStackZoomTransitionDimmingBlurEffect | null,
    interactiveDismissEnabled: boolean | null
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
  ZoomTransitionModule?.setRouteConfig(
    routeKey,
    sourceId ?? null,
    targetId ?? null,
    dimmingColor ?? null,
    dimmingBlurEffect ?? null,
    interactiveDismissEnabled ?? null
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
