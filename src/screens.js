import React from 'react';
import {
  Animated,
  requireNativeComponent,
  View,
  UIManager,
  StyleSheet,
} from 'react-native';

class ScreenComponent extends React.Component {
  render() {
    // Filter out active prop in this case because it is unused and
    // can cause problems depending on react-native version:
    // https://github.com/react-navigation/react-navigation/issues/4886

    /* eslint-disable no-unused-vars */
    const { active, onComponentRef, ...props } = this.props;

    return <Animated.View {...props} ref={onComponentRef} />;
  }
}

let ScreenContainer = View;
let Screen = ScreenComponent;

// If RNSScreen native component is available, instead of using plain RN Views
// for ScreenContainer and Screen components, we can use native component
// provided by react-native-screens lib. Note that we don't specify
// react-native-screens as a dependency, but instead we check whether the library
// is linked natively (we only `require` the lib if native components are installed)
if (UIManager['RNSScreen']) {
  // native screen components are available

  const NativeScreen = Animated.createAnimatedComponent(
    requireNativeComponent('RNSScreen', null)
  );

  const NativeScreenContainer = requireNativeComponent(
    'RNSScreenContainer',
    null
  );

  class WrappedNativeScreen extends React.Component {
    setNativeProps(props) {
      this._ref.setNativeProps(props);
    }
    render() {
      const { style, children, ...rest } = this.props;
      return (
        <NativeScreen
          {...rest}
          ref={ref => (this._ref = ref)}
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

  Screen = WrappedNativeScreen;
  ScreenContainer = NativeScreenContainer;
}

export { ScreenContainer, Screen };
