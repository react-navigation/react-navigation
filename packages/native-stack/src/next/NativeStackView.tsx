import {
  type ParamListBase,
  type Route,
  type StackNavigationState,
  useTheme,
} from '@react-navigation/native';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Stack } from 'react-native-screens/experimental';

import type {
  NativeStackDescriptor,
  NativeStackDescriptorMap,
  NativeStackNavigationHelpers,
} from '../types';

type Props = {
  state: StackNavigationState<ParamListBase>;
  navigation: NativeStackNavigationHelpers;
  descriptors: NativeStackDescriptorMap;
};

export function NativeStackView({ state, navigation, descriptors }: Props) {
  const { colors } = useTheme();

  const [previous, setPrevious] = useState({
    routes: state.routes,
    descriptors,
  });

  const [popped, setPopped] = useState<
    {
      route: Route<string>;
      descriptor: NativeStackDescriptor;
    }[]
  >([]);

  if (state.routes !== previous.routes) {
    const nextPoppedRoutes = previous.routes.filter(
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
    state.routes !== previous.routes ||
    descriptors !== previous.descriptors
  ) {
    setPrevious({ routes: state.routes, descriptors });
  }

  const routes = [
    ...state.routes,
    ...popped.map((p) => p.route),
    ...state.preloadedRoutes,
  ];

  console.log('rendering stack view', {
    rendered: routes.map((r) => r.name),
    routes: state.routes.map((r) => r.name),
    popped: popped.map((p) => p.route.name),
  });

  return (
    <Stack.Host>
      {routes.map((route) => {
        const descriptor =
          descriptors[route.key] ||
          popped.find((p) => p.route.key === route.key)?.descriptor;

        const { render } = descriptor;

        const isPopped = popped.some((p) => p.route.key === route.key);
        const isPreloaded = state.preloadedRoutes.some(
          (r) => r.key === route.key
        );

        return (
          <Stack.Screen
            key={route.key}
            screenKey={route.key}
            activityMode={isPopped || isPreloaded ? 'detached' : 'attached'}
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
            onNativeDismiss={() => {
              console.log('native dismissed', route.key);
              // TODO
            }}
          >
            <View
              style={[styles.container, { backgroundColor: colors.background }]}
            >
              {render()}
            </View>
          </Stack.Screen>
        );
      })}
    </Stack.Host>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
