import React from 'react';
import {
  Animated,
  requireNativeComponent,
  View,
  UIManager,
  StyleSheet,
} from 'react-native';

let USE_SCREENS = false;

export function useScreens(shouldUseScreens = true) {
  USE_SCREENS = shouldUseScreens;
  if (USE_SCREENS && !UIManager['RNSScreen']) {
    console.error(
      `Screen native module hasn't been linked. Please check the react-native-screens README for more details`
    );
  }
}

export function screensEnabled() {
  return USE_SCREENS;
}

const NativeScreen = Animated.createAnimatedComponent(
  requireNativeComponent('RNSScreen', null)
);

const NativeScreenContainer = requireNativeComponent(
  'RNSScreenContainer',
  null
);

export class Screen extends React.Component {
  setNativeProps(props) {
    this._ref.setNativeProps(props);
  }
  setRef = ref => {
    this._ref = ref;
    this.props.onComponentRef && this.props.onComponentRef(ref);
  };
  render() {
    if (!USE_SCREENS) {
      // Filter out active prop in this case because it is unused and
      // can cause problems depending on react-native version:
      // https://github.com/react-navigation/react-navigation/issues/4886

      /* eslint-disable no-unused-vars */
      const { active, onComponentRef, ...props } = this.props;

      return <Animated.View {...props} ref={this.setRef} />;
    } else {
      const { style, children, ...rest } = this.props;
      return (
        <NativeScreen
          {...rest}
          ref={this.setRef}
          style={StyleSheet.absoluteFill}>
          {/*
            We need to wrap children in additional Animated.View because
            of a bug in native driver preventing from both `active` and `styles`
            props begin animated in `NativeScreen` component. Once
            react-native/pull/20658 is merged we can export native screen directly
            and avoid wrapping with `Animated.View`.
          */}
          <Animated.View style={style}>{children}</Animated.View>
        </NativeScreen>
      );
    }
  }
}

export class ScreenContainer extends React.Component {
  render() {
    if (!USE_SCREENS) {
      return <View {...this.props} />;
    } else {
      return <NativeScreenContainer {...this.props} />;
    }
  }
}
