import * as React from 'react';
import { StyleSheet, I18nManager, StyleProp, ViewStyle } from 'react-native';
import Animated from 'react-native-reanimated';

import memoize from './memoize';
import { Route, SceneRendererProps, NavigationState } from './types';

export type Props<T extends Route> = SceneRendererProps & {
  navigationState: NavigationState<T>;
  width: number;
  style?: StyleProp<ViewStyle>;
};

const { max, min, multiply } = Animated;

export default class TabBarIndicator<T extends Route> extends React.Component<
  Props<T>
> {
  private getTranslateX = memoize(
    (position: Animated.Node<number>, routes: Route[], width: number) =>
      multiply(
        max(min(position, routes.length - 1), 0),
        width * (I18nManager.isRTL ? -1 : 1)
      )
  );

  render() {
    const { width, position, navigationState, style } = this.props;
    const { routes } = navigationState;

    const translateX = this.getTranslateX(position, routes, width);

    return (
      <Animated.View
        style={[
          styles.indicator,
          { width: `${100 / routes.length}%` },
          // If layout is not available, use `left` property for positioning the indicator
          // This avoids rendering delay until we are able to calculate translateX
          width
            ? { transform: [{ translateX }] as any }
            : { left: `${(100 / routes.length) * navigationState.index}%` },
          style,
        ]}
      />
    );
  }
}

const styles = StyleSheet.create({
  indicator: {
    backgroundColor: '#ffeb3b',
    position: 'absolute',
    left: 0,
    bottom: 0,
    right: 0,
    height: 2,
  },
});
