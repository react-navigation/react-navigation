import { getHeaderTitle, HeaderBackContext } from '@react-navigation/elements';
import {
  NavigationContext,
  NavigationRouteContext,
  type ParamListBase,
  type Route,
  useLinkBuilder,
} from '@react-navigation/native';
import * as React from 'react';
import {
  Animated,
  type StyleProp,
  StyleSheet,
  View,
  type ViewStyle,
} from 'react-native';

import {
  forNoAnimation,
  forSlideLeft,
  forSlideRight,
  forSlideUp,
} from '../../TransitionConfigs/HeaderStyleInterpolators';
import type {
  Layout,
  Scene,
  StackHeaderMode,
  StackHeaderProps,
  StackNavigationProp,
} from '../../types';
import { Header } from './Header';

export type Props = {
  mode: StackHeaderMode;
  layout: Layout;
  scenes: (Scene | undefined)[];
  getPreviousScene: (props: { route: Route<string> }) => Scene | undefined;
  getFocusedRoute: () => Route<string>;
  onContentHeightChange?: (props: {
    route: Route<string>;
    height: number;
  }) => void;
  style?: Animated.WithAnimatedValue<StyleProp<ViewStyle>>;
};

export function HeaderContainer({
  mode,
  scenes,
  layout,
  getPreviousScene,
  getFocusedRoute,
  onContentHeightChange,
  style,
}: Props) {
  const focusedRoute = getFocusedRoute();
  const parentHeaderBack = React.useContext(HeaderBackContext);
  const { buildHref } = useLinkBuilder();

  return (
    <Animated.View pointerEvents="box-none" style={style}>
      {scenes.slice(-3).map((scene, i, self) => {
        if ((mode === 'screen' && i !== self.length - 1) || !scene) {
          return null;
        }

        const {
          header,
          headerMode,
          headerShown = true,
          headerTransparent,
          headerStyleInterpolator,
        } = scene.descriptor.options;

        if (headerMode !== mode || !headerShown) {
          return null;
        }

        const isFocused = focusedRoute.key === scene.descriptor.route.key;
        const previousScene = getPreviousScene({
          route: scene.descriptor.route,
        });

        let headerBack = parentHeaderBack;

        if (previousScene) {
          const { options, route } = previousScene.descriptor;

          headerBack = previousScene
            ? {
                title: getHeaderTitle(options, route.name),
                href: buildHref(route.name, route.params),
              }
            : parentHeaderBack;
        }

        // If the screen is next to a headerless screen, we need to make the header appear static
        // This makes the header look like it's moving with the screen
        const previousDescriptor = self[i - 1]?.descriptor;
        const nextDescriptor = self[i + 1]?.descriptor;

        const {
          headerShown: previousHeaderShown = true,
          headerMode: previousHeaderMode,
        } = previousDescriptor?.options || {};

        // If any of the next screens don't have a header or header is part of the screen
        // Then we need to move this header offscreen so that it doesn't cover it
        const nextHeaderlessScene = self.slice(i + 1).find((scene) => {
          const {
            headerShown: currentHeaderShown = true,
            headerMode: currentHeaderMode,
          } = scene?.descriptor.options || {};

          return currentHeaderShown === false || currentHeaderMode === 'screen';
        });

        const { gestureDirection: nextHeaderlessGestureDirection } =
          nextHeaderlessScene?.descriptor.options || {};

        const isHeaderStatic =
          ((previousHeaderShown === false || previousHeaderMode === 'screen') &&
            // We still need to animate when coming back from next scene
            // A hacky way to check this is if the next scene exists
            !nextDescriptor) ||
          nextHeaderlessScene;

        const props: StackHeaderProps = {
          layout,
          back: headerBack,
          progress: scene.progress,
          options: scene.descriptor.options,
          route: scene.descriptor.route,
          navigation: scene.descriptor
            .navigation as StackNavigationProp<ParamListBase>,
          styleInterpolator:
            mode === 'float'
              ? isHeaderStatic
                ? nextHeaderlessGestureDirection === 'vertical' ||
                  nextHeaderlessGestureDirection === 'vertical-inverted'
                  ? forSlideUp
                  : nextHeaderlessGestureDirection === 'horizontal-inverted'
                    ? forSlideRight
                    : forSlideLeft
                : headerStyleInterpolator
              : forNoAnimation,
        };

        return (
          <NavigationContext.Provider
            key={scene.descriptor.route.key}
            value={scene.descriptor.navigation}
          >
            <NavigationRouteContext.Provider value={scene.descriptor.route}>
              <View
                onLayout={
                  onContentHeightChange
                    ? (e) => {
                        const { height } = e.nativeEvent.layout;

                        onContentHeightChange({
                          route: scene.descriptor.route,
                          height,
                        });
                      }
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
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  header: {
    position: 'absolute',
    top: 0,
    start: 0,
    end: 0,
  },
});
