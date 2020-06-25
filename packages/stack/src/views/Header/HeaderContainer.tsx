import * as React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import {
  NavigationContext,
  NavigationRouteContext,
  Route,
  ParamListBase,
} from '@react-navigation/native';
import type { EdgeInsets } from 'react-native-safe-area-context';

import Header from './Header';
import {
  forSlideLeft,
  forSlideUp,
  forNoAnimation,
  forSlideRight,
} from '../../TransitionConfigs/HeaderStyleInterpolators';
import HeaderShownContext from '../../utils/HeaderShownContext';
import PreviousSceneContext from '../../utils/PreviousSceneContext';
import type {
  Layout,
  Scene,
  StackHeaderStyleInterpolator,
  StackNavigationProp,
  GestureDirection,
} from '../../types';

export type Props = {
  mode: 'float' | 'screen';
  layout: Layout;
  insets: EdgeInsets;
  scenes: (Scene<Route<string>> | undefined)[];
  getPreviousScene: (props: {
    route: Route<string>;
  }) => Scene<Route<string>> | undefined;
  getFocusedRoute: () => Route<string>;
  onContentHeightChange?: (props: {
    route: Route<string>;
    height: number;
  }) => void;
  styleInterpolator: StackHeaderStyleInterpolator;
  gestureDirection: GestureDirection;
  style?: StyleProp<ViewStyle>;
};

export default function HeaderContainer({
  mode,
  scenes,
  layout,
  insets,
  getPreviousScene,
  getFocusedRoute,
  onContentHeightChange,
  gestureDirection,
  styleInterpolator,
  style,
}: Props) {
  const focusedRoute = getFocusedRoute();
  const isParentHeaderShown = React.useContext(HeaderShownContext);
  const parentPreviousScene = React.useContext(PreviousSceneContext);

  return (
    <View pointerEvents="box-none" style={style}>
      {scenes.slice(-3).map((scene, i, self) => {
        if ((mode === 'screen' && i !== self.length - 1) || !scene) {
          return null;
        }

        const {
          header,
          headerShown = isParentHeaderShown === false,
          headerTransparent,
        } = scene.descriptor.options || {};

        if (!headerShown) {
          return null;
        }

        const isFocused = focusedRoute.key === scene.route.key;
        const previous =
          getPreviousScene({ route: scene.route }) ?? parentPreviousScene;

        // If the screen is next to a headerless screen, we need to make the header appear static
        // This makes the header look like it's moving with the screen
        const previousScene = self[i - 1];
        const nextScene = self[i + 1];

        const {
          headerShown: previousHeaderShown = isParentHeaderShown === false,
        } = previousScene?.descriptor.options || {};

        const { headerShown: nextHeaderShown = isParentHeaderShown === false } =
          nextScene?.descriptor.options || {};

        const isHeaderStatic =
          (previousHeaderShown === false &&
            // We still need to animate when coming back from next scene
            // A hacky way to check this is if the next scene exists
            !nextScene) ||
          nextHeaderShown === false;

        const props = {
          mode,
          layout,
          insets,
          scene,
          previous,
          navigation: scene.descriptor.navigation as StackNavigationProp<
            ParamListBase
          >,
          styleInterpolator:
            mode === 'float'
              ? isHeaderStatic
                ? gestureDirection === 'vertical' ||
                  gestureDirection === 'vertical-inverted'
                  ? forSlideUp
                  : gestureDirection === 'horizontal-inverted'
                  ? forSlideRight
                  : forSlideLeft
                : styleInterpolator
              : forNoAnimation,
        };

        return (
          <NavigationContext.Provider
            key={scene.route.key}
            value={scene.descriptor.navigation}
          >
            <NavigationRouteContext.Provider value={scene.route}>
              <View
                onLayout={
                  onContentHeightChange
                    ? (e) =>
                        onContentHeightChange({
                          route: scene.route,
                          height: e.nativeEvent.layout.height,
                        })
                    : undefined
                }
                pointerEvents={isFocused ? 'box-none' : 'none'}
                accessibilityElementsHidden={!isFocused}
                importantForAccessibility={
                  isFocused ? 'auto' : 'no-hide-descendants'
                }
                style={
                  // Avoid positioning the focused header absolutely
                  // Otherwise accessibility tools don't seem to be able to find it
                  (mode === 'float' && !isFocused) || headerTransparent
                    ? styles.header
                    : null
                }
              >
                {header !== undefined ? header(props) : <Header {...props} />}
              </View>
            </NavigationRouteContext.Provider>
          </NavigationContext.Provider>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
});
