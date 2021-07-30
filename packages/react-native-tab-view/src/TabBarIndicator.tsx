import * as React from 'react';
import {
  Animated,
  Easing,
  StyleSheet,
  I18nManager,
  StyleProp,
  ViewStyle,
  Platform,
} from 'react-native';

import type { Route, SceneRendererProps, NavigationState } from './types';

export type GetTabWidth = (index: number) => number;

export type Props<T extends Route> = SceneRendererProps & {
  navigationState: NavigationState<T>;
  width: string | number;
  style?: StyleProp<ViewStyle>;
  getTabWidth: GetTabWidth;
};

export default class TabBarIndicator<T extends Route> extends React.Component<
  Props<T>
> {
  componentDidMount() {
    this.fadeInIndicator();
  }

  componentDidUpdate() {
    this.fadeInIndicator();
  }

  private fadeInIndicator = () => {
    const { navigationState, layout, width, getTabWidth } = this.props;

    if (
      !this.isIndicatorShown &&
      width === 'auto' &&
      layout.width &&
      // We should fade-in the indicator when we have widths for all the tab items
      navigationState.routes.every((_, i) => getTabWidth(i))
    ) {
      this.isIndicatorShown = true;

      Animated.timing(this.opacity, {
        toValue: 1,
        duration: 150,
        easing: Easing.in(Easing.linear),
        useNativeDriver: true,
      }).start();
    }
  };

  private isIndicatorShown = false;

  private opacity = new Animated.Value(this.props.width === 'auto' ? 0 : 1);

  private getTranslateX = (
    position: Animated.AnimatedInterpolation,
    routes: Route[],
    getTabWidth: GetTabWidth
  ) => {
    const inputRange = routes.map((_, i) => i);

    // every index contains widths at all previous indices
    const outputRange = routes.reduce<number[]>((acc, _, i) => {
      if (i === 0) return [0];
      return [...acc, acc[i - 1] + getTabWidth(i - 1)];
    }, []);

    const translateX = position.interpolate({
      inputRange,
      outputRange,
      extrapolate: 'clamp',
    });

    return Animated.multiply(translateX, I18nManager.isRTL ? -1 : 1);
  };

  render() {
    const { position, navigationState, getTabWidth, width, style, layout } =
      this.props;
    const { routes } = navigationState;

    const transform = [];

    if (layout.width) {
      const translateX =
        routes.length > 1
          ? this.getTranslateX(position, routes, getTabWidth)
          : 0;

      transform.push({ translateX });
    }

    if (width === 'auto') {
      const inputRange = routes.map((_, i) => i);
      const outputRange = inputRange.map(getTabWidth);

      transform.push(
        {
          scaleX:
            routes.length > 1
              ? position.interpolate({
                  inputRange,
                  outputRange,
                  extrapolate: 'clamp',
                })
              : outputRange[0],
        },
        { translateX: 0.5 }
      );
    }

    return (
      <Animated.View
        style={[
          styles.indicator,
          { width: width === 'auto' ? 1 : width },
          // If layout is not available, use `left` property for positioning the indicator
          // This avoids rendering delay until we are able to calculate translateX
          // If platform is macos use `left` property as `transform` is broken at the moment.
          // See: https://github.com/microsoft/react-native-macos/issues/280
          layout.width && Platform.OS !== 'macos'
            ? { left: 0 }
            : { left: `${(100 / routes.length) * navigationState.index}%` },
          { transform },
          width === 'auto' ? { opacity: this.opacity } : null,
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
