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

type Props = {
  mode: 'float' | 'screen';
  layout: Layout;
  scenes: HeaderScene<Route>[];
  navigation: NavigationProp;
  onLayout?: (e: LayoutChangeEvent) => void;
  styleInterpolator: HeaderStyleInterpolator;
  style?: StyleProp<ViewStyle>;
};

export default function HeaderContainer({
  mode,
  scenes,
  layout,
  navigation,
  onLayout,
  styleInterpolator,
  style,
}: Props) {
  const focusedRoute = navigation.state.routes[navigation.state.index];

  return (
    <View pointerEvents="box-none" style={style}>
      {scenes.map((scene, i, self) => {
        if (mode === 'screen' && i !== self.length - 1) {
          return null;
        }

        const { options } = scene.descriptor;
        const isFocused = focusedRoute.key === scene.route.key;

        const props = {
          mode,
          layout,
          scene,
          previous: self[i - 1],
          navigation: scene.descriptor.navigation,
          styleInterpolator,
        };

        return (
          <View
            key={scene.route.key}
            onLayout={onLayout}
            pointerEvents={isFocused ? 'box-none' : 'none'}
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
