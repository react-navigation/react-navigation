import {
  type ParamListBase,
  type StackNavigationState,
  useTheme,
} from '@react-navigation/native';
import { StyleSheet, View } from 'react-native';
import { Stack } from 'react-native-screens/experimental';

import type {
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

  return (
    <Stack.Host>
      {[...state.routes, ...state.preloadedRoutes].map((route) => {
        const descriptor = descriptors[route.key];
        const { render } = descriptor;

        const isPreloaded = state.preloadedRoutes?.some(
          (r) => r.key === route.key
        );

        return (
          <Stack.Screen
            key={route.key}
            screenKey={route.key}
            activityMode={isPreloaded ? 'detached' : 'attached'}
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
            onDismiss={() => {
              // TODO
            }}
            onNativeDismiss={() => {
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
