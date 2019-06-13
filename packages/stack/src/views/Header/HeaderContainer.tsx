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

        const props = {
          mode,
          layout,
          scene,
          previous,
          navigation: scene.descriptor.navigation,
          styleInterpolator,
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
              { height: getDefaultHeaderHeight(layout) },
              mode === 'float' ? StyleSheet.absoluteFill : null,
              options.headerStyle,
            ]}
          >
            {options.header !== undefined ? (
              options.header == null ? null : (
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
