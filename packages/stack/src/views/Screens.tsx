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
  ...rest
}: ViewProps & {
  enabled: boolean;
  children: React.ReactNode;
}) => {
  if (enabled && Platform.OS !== 'web' && Screens && Screens.screensEnabled()) {
    return <Screens.ScreenContainer {...rest} />;
  }

  return <View {...rest} />;
};

export const MaybeScreen = ({
  enabled,
  active,
  ...rest
}: ViewProps & {
  enabled: boolean;
  active: 0 | 1 | Animated.AnimatedInterpolation;
  children: React.ReactNode;
}) => {
  if (enabled && Platform.OS === 'web') {
    // @ts-expect-error: the Animated.createAnimatedComponent types don't work properly
    return <AnimatedWebScreen active={active} {...rest} />;
  }

  if (enabled && Screens && Screens.screensEnabled()) {
    // @ts-expect-error: stackPresentation is incorrectly marked as required
    return <Screens.Screen active={active} {...rest} />;
  }

  return <View {...rest} />;
};
