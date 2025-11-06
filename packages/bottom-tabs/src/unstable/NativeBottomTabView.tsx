import {
  Container,
  Lazy,
  SafeAreaProviderCompat,
} from '@react-navigation/elements';
import {
  type ParamListBase,
  type TabNavigationState,
} from '@react-navigation/native';
import { Platform, StyleSheet } from 'react-native';
import { Screen, ScreenContainer } from 'react-native-screens';

import { ScreenContent } from './ScreenContent';
import type {
  NativeBottomTabDescriptorMap,
  NativeBottomTabNavigationConfig,
  NativeBottomTabNavigationHelpers,
} from './types';
import { BottomTabBar } from './views/BottomTabBar';

type Props = NativeBottomTabNavigationConfig & {
  state: TabNavigationState<ParamListBase>;
  navigation: NativeBottomTabNavigationHelpers;
  descriptors: NativeBottomTabDescriptorMap;
};

const STATE_INACTIVE = 0;
const STATE_ON_TOP = 2;

export function NativeBottomTabView({ state, descriptors, navigation }: Props) {
  // TODO: Implement
  // Fix content not being visible on web when this is false
  const detachInactiveScreens = true;
  const hasTwoStates = true;

  const { routes } = state;

  return (
    <SafeAreaProviderCompat>
      <ScreenContainer
        key="screens"
        enabled={detachInactiveScreens}
        hasTwoStates={hasTwoStates}
        style={styles.screens}
      >
        {routes.map((route, index) => {
          const descriptor = descriptors[route.key];

          const { navigation, options, render } = descriptor;

          const { lazy = true, freezeOnBlur, sceneStyle } = options;

          const isFocused = state.index === index;
          const isPreloaded = state.preloadedRouteKeys.includes(route.key);

          const content = (
            <Lazy enabled={lazy} visible={isFocused || isPreloaded}>
              {/* TODO: provide tab bar height */}
              <ScreenContent
                isFocused={isFocused}
                route={route}
                navigation={navigation}
                options={options}
                style={sceneStyle}
              >
                {render()}
              </ScreenContent>
            </Lazy>
          );

          // TODO
          const animationEnabled = false;

          if (Platform.OS === 'web') {
            /**
             * Don't use react-native-screens on web:
             * - It applies display: none as fallback, which triggers `onLayout` events
             * - We still need to hide the view when screens is not enabled
             * - We can use `inert` to handle a11y better for unfocused screens
             */
            return (
              <Container
                key={route.key}
                inert={!isFocused}
                style={{
                  ...StyleSheet.absoluteFillObject,
                  visibility: isFocused ? 'visible' : 'hidden',
                }}
              >
                {content}
              </Container>
            );
          }

          const activityState = isFocused
            ? STATE_ON_TOP // the screen is on top after the transition
            : animationEnabled // is animation is not enabled, immediately move to inactive state
              ? STATE_INACTIVE // TODO
              : STATE_INACTIVE;

          return (
            <Screen
              key={route.key}
              style={[
                StyleSheet.absoluteFill,
                {
                  zIndex: isFocused ? 0 : -1,
                  pointerEvents: isFocused ? 'auto' : 'none',
                },
              ]}
              activityState={activityState}
              enabled={detachInactiveScreens}
              freezeOnBlur={freezeOnBlur}
              shouldFreeze={activityState === STATE_INACTIVE && !isPreloaded}
            >
              {content}
            </Screen>
          );
        })}
      </ScreenContainer>
      <BottomTabBar
        state={state}
        descriptors={descriptors}
        navigation={navigation}
      />
    </SafeAreaProviderCompat>
  );
}

const styles = StyleSheet.create({
  screens: {
    flex: 1,
    overflow: 'hidden',
  },
});
