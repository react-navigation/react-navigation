import { getHeaderTitle, HeaderBackContext } from '@react-navigation/elements';
import { ActivityView } from '@react-navigation/elements/internal';
import {
  NavigationProvider,
  type Route,
  useLinkBuilder,
} from '@react-navigation/native';
import * as React from 'react';
import {
  type LayoutChangeEvent,
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
import type { Scene, StackHeaderMode, StackHeaderProps } from '../../types';
import { Header } from './Header';

export type HeaderHeight = {
  measured: boolean;
  value: number;
};

export type Props = {
  mode: StackHeaderMode;
  scenes: (Scene | undefined)[];
  getPreviousScene: (props: { route: Route<string> }) => Scene | undefined;
  getFocusedRoute: () => Route<string>;
  contentHeight: HeaderHeight | undefined;
  onContentHeightChange: (props: {
    route: Route<string>;
    height: number;
  }) => void;
  style?: StyleProp<ViewStyle>;
};

export function HeaderContainer({
  mode,
  scenes,
  getPreviousScene,
  getFocusedRoute,
  contentHeight,
  onContentHeightChange,
  style,
}: Props) {
  const focusedRoute = getFocusedRoute();
  const parentHeaderBack = React.use(HeaderBackContext);
  const { buildHref } = useLinkBuilder();

  return (
    <View style={[styles.container, style]}>
      {scenes.map((scene, i, self) => {
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

        const { headerTransparent: nextHeaderTransparent } =
          nextDescriptor?.options || {};

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
          // If next header is tranparent, we want to treat this header as static
          // Otherwise it may show through the next header
          nextHeaderTransparent ||
          nextHeaderlessScene;

        const props: StackHeaderProps = {
          back: headerBack,
          progress: scene.progress,
          options: scene.descriptor.options,
          route: scene.descriptor.route,
          navigation: scene.descriptor.navigation,
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

        const onRef = (node: View | null) => {
          node?.measure((_x, _y, _width, height) => {
            if (height && !contentHeight?.measured) {
              onContentHeightChange({
                route: scene.descriptor.route,
                height,
              });
            }
          });
        };

        const onLayout = (e: LayoutChangeEvent) => {
          const { height } = e.nativeEvent.layout;

          onContentHeightChange({
            route: scene.descriptor.route,
            height,
          });
        };

        return (
          <NavigationProvider
            key={scene.descriptor.route.key}
            navigation={scene.descriptor.navigation}
            route={scene.descriptor.route}
          >
            <View
              style={[
                // Avoid absolutely positioning the focused header unnecessarily
                // Otherwise accessibility tools don't seem to be able to find it
                (mode === 'float' && !isFocused) || headerTransparent
                  ? [
                      styles.absolute,
                      mode === 'screen'
                        ? // For transparent headers, specify a min height
                          // This is needed for screen readers, and testing tools on Android
                          // For float header, it's handled in CardStack
                          { minHeight: contentHeight?.value }
                        : null,
                    ]
                  : null,
                {
                  pointerEvents: isFocused ? 'box-none' : 'none',
                },
              ]}
            >
              <View
                ref={onRef}
                onLayout={onLayout}
                style={{ pointerEvents: 'box-none' }}
              >
                <ActivityView
                  mode={isFocused ? 'normal' : 'inert'}
                  visible={true}
                >
                  {header !== undefined ? header(props) : <Header {...props} />}
                </ActivityView>
              </View>
            </View>
          </NavigationProvider>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    pointerEvents: 'box-none',
  },
  absolute: {
    position: 'absolute',
    top: 0,
    start: 0,
    end: 0,
  },
});
