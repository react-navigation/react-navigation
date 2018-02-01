import React, { Component } from 'react';
import {
  DeviceInfo,
  Dimensions,
  InteractionManager,
  NativeModules,
  Platform,
  SafeAreaView,
  StyleSheet,
  Animated,
} from 'react-native';
import withOrientation from './withOrientation';

// See https://mydevice.io/devices/ for device dimensions
const X_WIDTH = 375;
const X_HEIGHT = 812;
const PAD_WIDTH = 768;
const PAD_HEIGHT = 1024;

const { height: D_HEIGHT, width: D_WIDTH } = Dimensions.get('window');

const { PlatformConstants = {} } = NativeModules;
const { minor = 0 } = PlatformConstants.reactNativeVersion || {};

const isIPhoneX = (() => {
  if (Platform.OS === 'web') return false;

  if (minor >= 50) {
    return DeviceInfo.isIPhoneX_deprecated;
  }

  return (
    Platform.OS === 'ios' &&
    ((D_HEIGHT === X_HEIGHT && D_WIDTH === X_WIDTH) ||
      (D_HEIGHT === X_WIDTH && D_WIDTH === X_HEIGHT))
  );
})();

const isIPad = (() => {
  if (Platform.OS !== 'ios' || isIPhoneX) return false;

  // if portrait and width is smaller than iPad width
  if (D_HEIGHT > D_WIDTH && D_WIDTH < PAD_WIDTH) {
    return false;
  }

  // if landscape and height is smaller that iPad height
  if (D_WIDTH > D_HEIGHT && D_HEIGHT < PAD_WIDTH) {
    return false;
  }

  return true;
})();

const statusBarHeight = isLandscape => {
  if (isIPhoneX) {
    return isLandscape ? 0 : 44;
  }

  if (isIPad) {
    return 20;
  }

  return isLandscape ? 0 : 20;
};

const doubleFromPercentString = percent => {
  if (!percent.includes('%')) {
    return 0;
  }

  const dbl = parseFloat(percent) / 100;

  if (isNaN(dbl)) return 0;

  return dbl;
};

class SafeView extends Component {
  state = {
    touchesTop: true,
    touchesBottom: true,
    touchesLeft: true,
    touchesRight: true,
    orientation: null,
    viewWidth: 0,
    viewHeight: 0,
  };

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this._onLayout();
    });
  }

  componentWillReceiveProps() {
    this._onLayout();
  }

  render() {
    const { forceInset = false, isLandscape, children, style } = this.props;

    if (Platform.OS !== 'ios') {
      return <Animated.View style={style}>{this.props.children}</Animated.View>;
    }

    const safeAreaStyle = this._getSafeAreaStyle();

    return (
      <Animated.View
        ref={c => (this.view = c)}
        onLayout={this._onLayout}
        style={safeAreaStyle}
      >
        {this.props.children}
      </Animated.View>
    );
  }

  _onLayout = () => {
    if (!this.view) return;

    const { isLandscape } = this.props;
    const { orientation } = this.state;
    const newOrientation = isLandscape ? 'landscape' : 'portrait';
    if (orientation && orientation === newOrientation) {
      return;
    }

    const WIDTH = isLandscape ? X_HEIGHT : X_WIDTH;
    const HEIGHT = isLandscape ? X_WIDTH : X_HEIGHT;

    this.view._component.measureInWindow((winX, winY, winWidth, winHeight) => {
      let realY = winY;
      let realX = winX;

      if (realY >= HEIGHT) {
        realY = realY % HEIGHT;
      } else if (realY < 0) {
        realY = realY % HEIGHT + HEIGHT;
      }

      if (realX >= WIDTH) {
        realX = realX % WIDTH;
      } else if (realX < 0) {
        realX = realX % WIDTH + WIDTH;
      }

      const touchesTop = realY === 0;
      const touchesBottom = realY + winHeight >= HEIGHT;
      const touchesLeft = realX === 0;
      const touchesRight = realX + winWidth >= WIDTH;

      this.setState({
        touchesTop,
        touchesBottom,
        touchesLeft,
        touchesRight,
        orientation: newOrientation,
        viewWidth: winWidth,
        viewHeight: winHeight,
      });
    });
  };

  _getSafeAreaStyle = () => {
    const { touchesTop, touchesBottom, touchesLeft, touchesRight } = this.state;
    const { forceInset, isLandscape } = this.props;

    const {
      paddingTop,
      paddingBottom,
      paddingLeft,
      paddingRight,
      viewStyle,
    } = this._getViewStyles();

    const style = {
      ...viewStyle,
      paddingTop: touchesTop ? this._getInset('top') : 0,
      paddingBottom: touchesBottom ? this._getInset('bottom') : 0,
      paddingLeft: touchesLeft ? this._getInset('left') : 0,
      paddingRight: touchesRight ? this._getInset('right') : 0,
    };

    if (forceInset) {
      Object.keys(forceInset).forEach(key => {
        let inset = forceInset[key];

        if (inset === 'always') {
          inset = this._getInset(key);
        }

        if (inset === 'never') {
          inset = 0;
        }

        switch (key) {
          case 'horizontal': {
            style.paddingLeft = inset;
            style.paddingRight = inset;
            break;
          }
          case 'vertical': {
            style.paddingTop = inset;
            style.paddingBottom = inset;
            break;
          }
          case 'left':
          case 'right':
          case 'top':
          case 'bottom': {
            const padding = `padding${key[0].toUpperCase()}${key.slice(1)}`;
            style[padding] = inset;
            break;
          }
        }
      });
    }

    // new height/width should only include padding from insets
    // height/width should not be affected by padding from style obj
    if (style.height && typeof style.height === 'number') {
      style.height += style.paddingTop + style.paddingBottom;
    }

    if (style.width && typeof style.width === 'number') {
      style.width += style.paddingLeft + style.paddingRight;
    }

    style.paddingTop += paddingTop;
    style.paddingBottom += paddingBottom;
    style.paddingLeft += paddingLeft;
    style.paddingRight += paddingRight;

    return style;
  };

  _getViewStyles = () => {
    const { viewWidth } = this.state;
    // get padding values from style to add back in after insets are determined
    // default precedence: padding[Side] -> vertical | horizontal -> padding -> 0
    let {
      padding = 0,
      paddingVertical = padding,
      paddingHorizontal = padding,
      paddingTop = paddingVertical,
      paddingBottom = paddingVertical,
      paddingLeft = paddingHorizontal,
      paddingRight = paddingHorizontal,
      ...viewStyle
    } = StyleSheet.flatten(this.props.style || {});

    if (typeof paddingTop !== 'number') {
      paddingTop = doubleFromPercentString(paddingTop) * viewWidth;
    }

    if (typeof paddingBottom !== 'number') {
      paddingBottom = doubleFromPercentString(paddingBottom) * viewWidth;
    }

    if (typeof paddingLeft !== 'number') {
      paddingLeft = doubleFromPercentString(paddingLeft) * viewWidth;
    }

    if (typeof paddingRight !== 'number') {
      paddingRight = doubleFromPercentString(paddingRight) * viewWidth;
    }

    return {
      paddingTop,
      paddingBottom,
      paddingLeft,
      paddingRight,
      viewStyle,
    };
  };

  _getInset = key => {
    const { isLandscape } = this.props;
    switch (key) {
      case 'horizontal':
      case 'right':
      case 'left': {
        return isLandscape ? (isIPhoneX ? 44 : 0) : 0;
      }
      case 'vertical':
      case 'top': {
        return statusBarHeight(isLandscape);
      }
      case 'bottom': {
        return isIPhoneX ? (isLandscape ? 24 : 34) : 0;
      }
    }
  };
}

export default withOrientation(SafeView);
