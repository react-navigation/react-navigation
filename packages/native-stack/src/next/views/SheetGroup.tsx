import {
  type Route,
  StackActions,
  usePreventRemoveContext,
  useTheme,
} from '@react-navigation/native';
import * as React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { FormSheet } from 'react-native-screens/experimental';

import type { NativeStackDescriptor } from '../../types';
import { type RouteGroupContext, useNativeDismiss } from './RouteGroupShared';

// Workaround for a missing Android callback in react-native-screens 4.26.2.
// The Android form sheet takes 250 ms to close, but it does not tell React
// Native when that animation ends. We use the same delay only to remove React
// routes that were kept alive for the closing animation. This must not be used
// to emit transition events. Remove it when Android reports that dismissal has
// finished.
const ANDROID_SHEET_DISMISS_DURATION = 250;

type Props = {
  context: RouteGroupContext;
  descriptor: NativeStackDescriptor;
  routesToDismiss: Route<string>[];
  isPresentationBlocked: boolean;
};

export function SheetGroup({
  context,
  descriptor,
  routesToDismiss,
  isPresentationBlocked,
}: Props) {
  const {
    state,
    navigation,
    poppedRouteKeys,
    routeIndexByKey,
    onRemovePoppedRoute,
  } = context;

  const { preventedRoutes } = usePreventRemoveContext();
  const { colors } = useTheme();
  const dismissRoutes = useNativeDismiss(context);

  const { options, route: sheetRoute } = descriptor;

  const routeIndex = routeIndexByKey.get(sheetRoute.key) ?? -1;
  const isOpen =
    routeIndex !== -1 && routeIndex <= state.index && !isPresentationBlocked;

  const emitSheetTransition = (
    type: 'transitionStart' | 'transitionEnd',
    closing: boolean
  ) => {
    navigation.emit({ type, data: { closing }, target: sheetRoute.key });
  };

  const removeDismissedRoutes = React.useCallback(() => {
    for (const route of routesToDismiss) {
      if (poppedRouteKeys.has(route.key)) {
        onRemovePoppedRoute(route.key);
      }
    }
  }, [onRemovePoppedRoute, poppedRouteKeys, routesToDismiss]);

  React.useEffect(() => {
    if (Platform.OS !== 'android' || routeIndex !== -1) {
      return;
    }

    // This timer is the cleanup workaround described by the constant above.
    // Android lifecycle events remain unsupported.
    const timeout = setTimeout(
      removeDismissedRoutes,
      ANDROID_SHEET_DISMISS_DURATION + 1
    );

    return () => clearTimeout(timeout);
  }, [removeDismissedRoutes, routeIndex]);

  const isRemovePrevented =
    preventedRoutes[sheetRoute.key]?.preventRemove === true;

  return (
    <FormSheet
      isOpen={isOpen}
      detents={options.sheetAllowedDetents}
      initialDetentIndex={options.sheetInitialDetentIndex}
      largestUndimmedDetentIndex={options.sheetLargestUndimmedDetentIndex}
      preferredCornerRadius={options.sheetCornerRadius}
      prefersGrabberVisible={options.sheetGrabberVisible}
      prefersScrollingExpandsWhenScrolledToEdge={
        options.sheetExpandsWhenScrolledToEdge
      }
      // This prop only represents a removal blocked by usePreventRemove.
      // FormSheet has no gestureEnabled prop, so gestureEnabled is unsupported
      // and must not be approximated by preventing native dismissal.
      preventNativeDismiss={isRemovePrevented}
      onWillAppear={() => emitSheetTransition('transitionStart', false)}
      onDidAppear={() => emitSheetTransition('transitionEnd', false)}
      onWillDisappear={() => emitSheetTransition('transitionStart', true)}
      onDidDisappear={() => emitSheetTransition('transitionEnd', true)}
      onDetentChanged={(event) => {
        navigation.emit({
          type: 'sheetDetentChange',
          // FormSheet emits this callback only after the sheet settles at the
          // new detent, so the event is always stable.
          data: { index: event.nativeEvent.index, stable: true },
          target: sheetRoute.key,
        });
      }}
      onDismiss={removeDismissedRoutes}
      onNativeDismiss={() => {
        dismissRoutes({
          routeIndex,
          source: sheetRoute.key,
          // Android can still dismiss because its preventNativeDismiss setter
          // is empty. Do not record a native removal while usePreventRemove is
          // active, because the router can reject the matching pop action and
          // keep this route in state.
          markNativelyDismissed: !isRemovePrevented,
        });
      }}
      onNativeDismissPrevented={() => {
        if (routeIndex === -1) {
          return;
        }

        // The native sheet stayed open, but the attempted removal still needs
        // to pass through the router. This lets usePreventRemove deliver the
        // blocked action to the app so it can confirm or reject that action.
        navigation.dispatch({
          ...StackActions.pop(),
          source: sheetRoute.key,
          target: state.key,
        });
      }}
    >
      <View
        style={[
          options.sheetAllowedDetents === 'fitToContents'
            ? styles.fit
            : styles.fill,
          { backgroundColor: colors.background },
          options.contentStyle,
        ]}
      >
        {descriptor.render()}
      </View>
    </FormSheet>
  );
}

const styles = StyleSheet.create({
  fit: {
    width: '100%',
  },
  fill: {
    flex: 1,
  },
});
