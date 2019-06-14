import * as React from 'react';
import {
  View,
  StyleSheet,
  LayoutChangeEvent,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { getDefaultHeaderHeight } from './HeaderSegment';
import {
  Layout,
  Route,
  HeaderScene,
  NavigationProp,
  HeaderStyleInterpolator,
} from '../../types';
import Header from './Header';
import { forStatic } from '../../TransitionConfigs/HeaderStyleInterpolators';

export type Props = {
  mode: 'float' | 'screen';
  layout: Layout;
  scenes: Array<HeaderScene<Route> | undefined>;
  navigation: NavigationProp;
  getPreviousRoute: (props: { route: Route }) => Route | undefined;
  onLayout?: (e: LayoutChangeEvent) => void;
  styleInterpolator: HeaderStyleInterpolator;
  style?: StyleProp<ViewStyle>;
};

export default function HeaderContainer({
  mode,
  scenes,
  layout,
  navigation,
  getPreviousRoute,
  onLayout,
  styleInterpolator,
  style,
}: Props) {
  const focusedRoute = navigation.state.routes[navigation.state.index];

  return (
    <View pointerEvents="box-none" style={style}>
      {scenes.map((scene, i, self) => {
        if ((mode === 'screen' && i !== self.length - 1) || !scene) {
          return null;
        }

        const { options } = scene.descriptor;
        const isFocused = focusedRoute.key === scene.route.key;
        const previousRoute = getPreviousRoute({ route: scene.route });

        let previous;

        if (previousRoute) {
          // The previous scene will be shortly before the current scene in the array
          // So loop back from current index to avoid looping over the full array
          for (let j = i - 1; j >= 0; j--) {
            const s = self[j];

            if (s && s.route.key === previousRoute.key) {
              previous = s;
              break;
            }
          }
        }

        // If the screen is next to a headerless screen, we need to make the header appear static
        // This makes the header look like it's moving with the screen
        const previousScene = self[i - 1];
        const nextScene = self[i + 1];
        const isHeaderStatic =
          mode === 'float'
            ? (previousScene &&
                previousScene.descriptor.options.header === null &&
                // We still need to animate when coming back from next scene
                // A hacky way to check this is if the next scene exists
                !nextScene) ||
              (nextScene && nextScene.descriptor.options.header === null)
            : false;

        const props = {
          mode,
          layout,
          scene,
          previous,
          navigation: scene.descriptor.navigation,
          styleInterpolator: isHeaderStatic ? forStatic : styleInterpolator,
        };

        return (
          <View
            key={scene.route.key}
            onLayout={onLayout}
            pointerEvents="box-none"
            accessibilityElementsHidden={!isFocused}
            importantForAccessibility={
              isFocused ? 'auto' : 'no-hide-descendants'
            }
            style={[
              mode === 'float' ? StyleSheet.absoluteFill : null,
              mode === 'screen' && options.header !== undefined
                ? null
                : { height: getDefaultHeaderHeight(layout) },
              options.headerStyle,
            ]}
          >
            {options.header !== undefined ? (
              options.header === null ? null : (
                options.header(props)
              )
            ) : (
              <Header {...props} />
            )}
          </View>
        );
      })}
    </View>
  );
}
