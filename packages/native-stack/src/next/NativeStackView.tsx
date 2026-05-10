import { getHeaderTitle } from '@react-navigation/elements';
import { SafeAreaProviderCompat } from '@react-navigation/elements/internal';
import {
  NavigationProvider,
  type ParamListBase,
  type Route,
  StackActions,
  type StackNavigationState,
  usePreventRemoveContext,
  useTheme,
} from '@react-navigation/native';
import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { Stack } from 'react-native-screens/experimental';

import type {
  NativeStackDescriptor,
  NativeStackDescriptorMap,
  NativeStackNavigationHelpers,
} from '../types';
import { useDismissedRouteError } from '../utils/useDismissedRouteError';
import { useInvalidPreventRemoveError } from '../utils/useInvalidPreventRemoveError';

type Props = {
  state: StackNavigationState<ParamListBase>;
  navigation: NativeStackNavigationHelpers;
  descriptors: NativeStackDescriptorMap;
};

export function NativeStackView({ state, navigation, descriptors }: Props) {
  const { colors } = useTheme();
  const { preventedRoutes } = usePreventRemoveContext();
  const { setNextDismissedKey } = useDismissedRouteError(state);

  useInvalidPreventRemoveError(descriptors);

  const [previous, setPrevious] = React.useState({
    index: state.index,
    routes: state.routes,
    descriptors,
  });

  const [popped, setPopped] = React.useState<
    {
      route: Route<string>;
      descriptor: NativeStackDescriptor;
    }[]
  >([]);

  if (state.routes !== previous.routes) {
    const previousActiveRoutes = previous.routes.slice(0, previous.index + 1);
    const nextPoppedRoutes = previousActiveRoutes.filter(
      (r) =>
        !state.routes.some((route) => route.key === r.key) &&
        !popped.some((p) => p.route.key === r.key)
    );

    if (nextPoppedRoutes.length > 0) {
      setPopped((routes) => [
        ...routes,
        ...nextPoppedRoutes.map((r) => ({
          route: r,
          descriptor: descriptors[r.key] || previous.descriptors[r.key],
        })),
      ]);
    }
  }

  if (
    state.index !== previous.index ||
    state.routes !== previous.routes ||
    descriptors !== previous.descriptors
  ) {
    setPrevious({ index: state.index, routes: state.routes, descriptors });
  }

  const activeRoutes = state.routes.slice(0, state.index + 1);
  const preloadedRoutes = state.routes.slice(state.index + 1);
  const routes = [
    ...activeRoutes,
    ...popped.map((p) => p.route),
    ...preloadedRoutes,
  ];

  return (
    <SafeAreaProviderCompat>
      <Stack.Host>
        {routes.map((route) => {
          const descriptor =
            descriptors[route.key] ||
            popped.find((p) => p.route.key === route.key)?.descriptor;

          if (descriptor == null) {
            throw new Error(
              `Couldn't find descriptor for route ${route.name} (${route.key}). This is likely a bug.`
            );
          }

          const {
            navigation: descriptorNavigation,
            options,
            render,
          } = descriptor;

          const isPopped = popped.some((p) => p.route.key === route.key);
          const isPreloaded = preloadedRoutes.some((r) => r.key === route.key);
          const routeIndex = state.routes.findIndex((r) => r.key === route.key);
          const previousKey =
            routeIndex > 0 ? activeRoutes[routeIndex - 1]?.key : undefined;
          const previousDescriptor = previousKey
            ? descriptors[previousKey]
            : undefined;
          const isRemovePrevented = preventedRoutes[route.key]?.preventRemove;
          const headerTitle = getHeaderTitle(options, route.name);
          const unstableHeaderConfig = options.unstable_headerConfig;

          const headerConfig = {
            title: headerTitle,
            hidden: options.headerShown === false,
            transparent: options.headerTransparent,
            backButtonHidden:
              options.headerBackVisible === false || previousDescriptor == null,
            ...unstableHeaderConfig,
            android: {
              backButtonTintColor: options.headerTintColor,
              ...unstableHeaderConfig?.android,
            },
          };

          return (
            <Stack.Screen
              key={route.key}
              screenKey={route.key}
              activityMode={isPopped || isPreloaded ? 'detached' : 'attached'}
              preventNativeDismiss={isRemovePrevented}
              onWillAppear={() => {
                navigation.emit({
                  type: 'transitionStart',
                  data: { closing: false },
                  target: route.key,
                });
              }}
              onDidAppear={() => {
                navigation.emit({
                  type: 'transitionEnd',
                  data: { closing: false },
                  target: route.key,
                });
              }}
              onWillDisappear={() => {
                navigation.emit({
                  type: 'transitionStart',
                  data: { closing: true },
                  target: route.key,
                });
              }}
              onDidDisappear={() => {
                navigation.emit({
                  type: 'transitionEnd',
                  data: { closing: true },
                  target: route.key,
                });
              }}
              onDismiss={(screenKey) => {
                setPopped((popped) =>
                  popped.filter((p) => p.route.key !== screenKey)
                );
              }}
              onNativeDismiss={(screenKey) => {
                const routeIndex = state.routes.findIndex(
                  (r) => r.key === screenKey
                );

                if (routeIndex === -1) {
                  return;
                }

                const dismissCount = state.index - routeIndex + 1;

                if (dismissCount < 1) {
                  return;
                }

                navigation.dispatch({
                  ...StackActions.pop(dismissCount),
                  source: screenKey,
                  target: state.key,
                });

                setNextDismissedKey(screenKey);
              }}
              onNativeDismissPrevented={() => {
                navigation.dispatch({
                  ...StackActions.pop(),
                  source: route.key,
                  target: state.key,
                });
              }}
            >
              <NavigationProvider
                navigation={descriptorNavigation}
                route={route}
              >
                <View
                  style={[
                    styles.container,
                    { backgroundColor: colors.background },
                    options.contentStyle,
                  ]}
                >
                  {render()}
                </View>
                <Stack.HeaderConfig {...headerConfig} />
              </NavigationProvider>
            </Stack.Screen>
          );
        })}
      </Stack.Host>
    </SafeAreaProviderCompat>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
