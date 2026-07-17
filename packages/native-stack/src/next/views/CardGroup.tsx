import {
  NavigationProvider,
  type Route,
  StackActions,
  usePreventRemoveContext,
  useTheme,
} from '@react-navigation/native';
import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { Stack } from 'react-native-screens/experimental';

import type { NativeStackNavigationOptions } from '../../types';
import { CardContent } from './CardContent';
import { HeaderConfig } from './HeaderConfig';
import { type RouteGroupContext, useNativeDismiss } from './RouteGroupShared';

type Props = {
  children: React.ReactNode;
  context: RouteGroupContext;
  routes: Route<string>[];
};

export function CardGroup({ children, context, routes }: Props) {
  const {
    state,
    navigation,
    poppedRouteKeys,
    detachedRouteKeys,
    routeIndexByKey,
    getDescriptor,
    getPreviousDescriptor,
    onRemovePoppedRoute,
  } = context;

  const { colors } = useTheme();
  const { preventedRoutes } = usePreventRemoveContext();
  const dismissRoutes = useNativeDismiss(context);

  const renderScreen = (route: Route<string>) => {
    const descriptor = getDescriptor(route);
    const { inactiveBehavior = 'pause' } = descriptor.options;

    const index = routeIndexByKey.get(route.key) ?? -1;
    const isPopped = poppedRouteKeys.has(route.key);
    const isDetached = detachedRouteKeys.has(route.key);
    const emitTransition = (
      type: 'transitionStart' | 'transitionEnd',
      closing: boolean
    ) => {
      navigation.emit({ type, data: { closing }, target: route.key });
    };

    const previousDescriptor = getPreviousDescriptor(route);
    const isRemovePrevented = preventedRoutes[route.key]?.preventRemove;

    const activityMode = getActivityMode({
      inactiveBehavior,
      isFocused: index === state.index,
      isPopped,
      isDetached,
      isBeforeLast: index === state.index - 1,
      hasNestedState: 'state' in route && route.state != null,
    });

    return (
      <Stack.Screen
        key={route.key}
        screenKey={route.key}
        activityMode={isPopped || isDetached ? 'detached' : 'attached'}
        preventNativeDismiss={isRemovePrevented}
        onWillAppear={() => emitTransition('transitionStart', false)}
        onDidAppear={() => emitTransition('transitionEnd', false)}
        onWillDisappear={() => emitTransition('transitionStart', true)}
        onDidDisappear={() => emitTransition('transitionEnd', true)}
        onDismiss={onRemovePoppedRoute}
        onNativeDismiss={(screenKey) => {
          dismissRoutes({
            routeIndex: routeIndexByKey.get(screenKey) ?? -1,
            source: screenKey,
            markNativelyDismissed: true,
          });
        }}
        onNativeDismissPrevented={() => {
          // The native screen stayed in place, but the attempted removal still
          // needs to pass through the router. This lets usePreventRemove give
          // the blocked action to the app for confirmation.
          navigation.dispatch({
            ...StackActions.pop(),
            source: route.key,
            target: state.key,
          });
        }}
      >
        <NavigationProvider
          navigation={descriptor.navigation}
          route={descriptor.route}
        >
          <HeaderConfig
            descriptor={descriptor}
            previousDescriptor={previousDescriptor}
          >
            {(headerBack) => (
              <CardContent
                descriptor={descriptor}
                headerBack={headerBack}
                activityMode={activityMode}
                backgroundColor={colors.background}
              />
            )}
          </HeaderConfig>
        </NavigationProvider>
      </Stack.Screen>
    );
  };

  return (
    <View style={styles.container}>
      {routes.length > 0 ? (
        <Stack.Host>{routes.map(renderScreen)}</Stack.Host>
      ) : null}
      {children}
    </View>
  );
}

function getActivityMode({
  inactiveBehavior,
  isFocused,
  isPopped,
  isDetached,
  isBeforeLast,
  hasNestedState,
}: {
  inactiveBehavior: NonNullable<
    NativeStackNavigationOptions['inactiveBehavior']
  >;
  isFocused: boolean;
  isPopped: boolean;
  isDetached: boolean;
  isBeforeLast: boolean;
  hasNestedState: boolean;
}) {
  if (isFocused) {
    return 'normal';
  }

  if (inactiveBehavior === 'none' || isPopped || isDetached) {
    return 'inert';
  }

  if (inactiveBehavior === 'unmount' && !isBeforeLast && !hasNestedState) {
    return 'unmounted';
  }

  return 'paused';
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
