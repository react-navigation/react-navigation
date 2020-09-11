import * as React from 'react';
import { Animated, View, Platform, ViewProps } from 'react-native';

let Screens: typeof import('react-native-screens') | undefined;

try {
  Screens = require('react-native-screens');
} catch (e) {
  // Ignore
}

// The web implementation in react-native-screens seems buggy.
// The view doesn't become visible after coming back in some cases.
// So we use our custom implementation.
class WebScreen extends React.Component<
  ViewProps & {
    active: number;
    children: React.ReactNode;
  }
> {
  render() {
    const { active, style, ...rest } = this.props;

    return (
      <View
        // @ts-expect-error: hidden exists on web, but not in React Native
        hidden={!active}
        style={[style, { display: active ? 'flex' : 'none' }]}
        {...rest}
      />
    );
  }
}

const AnimatedWebScreen = Animated.createAnimatedComponent(WebScreen);

export const MaybeScreenContainer = ({
  enabled,
  activeLimit,
  ...rest
}: ViewProps & {
  enabled: boolean;
  activeLimit: number;
  children: React.ReactNode;
}) => {
  if (enabled && Platform.OS !== 'web' && Screens?.screensEnabled()) {
    return (
      // @ts-ignore
      <Screens.ScreenContainer
        enabled={enabled}
        activeLimit={activeLimit}
        {...rest}
      />
    );
  }

  return <View {...rest} />;
};

export const MaybeScreen = ({
  enabled,
  active,
  transitioning,
  isTop,
  ...rest
}: ViewProps & {
  enabled: boolean;
  active: 0 | 1 | Animated.AnimatedInterpolation;
  transitioning: 0 | Animated.AnimatedInterpolation;
  isTop: boolean;
  children: React.ReactNode;
}) => {
  if (enabled && Platform.OS === 'web') {
    return <AnimatedWebScreen active={active} {...rest} />;
  }

  if (enabled && Screens?.screensEnabled()) {
    return (
      // @ts-expect-error: stackPresentation is incorrectly marked as required
      <Screens.Screen
        isTransitioning={transitioning}
        isTop={isTop}
        enabled={enabled}
        active={active}
        {...rest}
      />
    );
  }

  return <View {...rest} />;
};
