import React, { Component } from 'react';
import {
  DeviceInfo,
  Dimensions,
  InteractionManager,
  NativeModules,
  Platform,
  SafeAreaView,
  View,
} from 'react-native';
import withOrientation from './withOrientation';

const { isIPhoneX_deprecated } = DeviceInfo;
const X_WIDTH = 375;
const X_HEIGHT = 812;

const { PlatformConstants = {} } = NativeModules;
const { minor = 0 } = PlatformConstants.reactNativeVersion || {};

const isIPhoneX = (() => {
  if (minor >= 50) {
    return isIPhoneX_deprecated;
  }

  const { height, width } = Dimensions.get('window');
  return (
    Platform.OS === 'ios' &&
    ((height === X_HEIGHT && width === X_WIDTH) ||
      (height === X_WIDTH && width === X_HEIGHT))
  );
})();

class SafeView extends Component {
  state = {
    touchesTop: true,
    touchesBottom: true,
    touchesLeft: true,
    touchesRight: true,
    orientation: null,
  };

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this._onLayout();
    });
  }

  componentWillReceiveProps(nextProps) {
    const { isLandscape, verbose } = nextProps;
    if (verbose) console.log(isLandscape);
    this._onLayout();
  }

  render() {
    const {
      forceInset = false,
      isLandscape,
      children,
      style,
      verbose,
    } = this.props;

    // if (verbose) {
    //   console.log(isLandscape);
    // }

    if (!Platform.OS === 'ios') {
      return <View style={style}>{this.props.children}</View>;
    }

    if (!forceInset && minor >= 50) {
      return <SafeAreaView style={style}>{this.props.children}</SafeAreaView>;
    }

    const safeAreaStyle = this._getSafeAreaStyle();

    return (
      <View
        ref={c => (this.view = c)}
        onLayout={this._onLayout}
        style={[style, safeAreaStyle]}
      >
        {this.props.children}
      </View>
    );
  }

  _onLayout = () => {
    if (!this.view) return;

    const { isLandscape, verbose } = this.props;
    const { orientation } = this.state;
    const newOrientation = isLandscape ? 'landscape' : 'portrait';
    if (orientation && orientation === newOrientation) {
      return;
    }

    const WIDTH = isLandscape ? X_HEIGHT : X_WIDTH;
    const HEIGHT = isLandscape ? X_WIDTH : X_HEIGHT;

    this.view.measureInWindow((winX, winY, winWidth, winHeight) => {
      let realY = winY;
      let realX = winX;

      while (realY >= HEIGHT) {
        realY -= HEIGHT;
      }

      while (realX >= WIDTH) {
        realX -= WIDTH;
      }

      while (realY < 0) {
        realY += HEIGHT;
      }

      while (realX < 0) {
        realX += WIDTH;
      }

      if (verbose) {
        console.log(realY, winHeight);
        console.log('');
        console.log(realX, winWidth);
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
      });
    });
  };

  _getSafeAreaStyle = () => {
    const { touchesTop, touchesBottom, touchesLeft, touchesRight } = this.state;
    const { forceInset, isLandscape } = this.props;

    const style = {
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
            const [firstLtr] = key;
            const padding = `padding${firstLtr.toUpperCase()}${key.slice(1)}`;
            style[padding] = inset;
            break;
          }
        }
      });
    }

    return style;
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
        return isLandscape ? 0 : isIPhoneX ? 44 : 20;
      }
      case 'bottom': {
        return isIPhoneX ? (isLandscape ? 24 : 34) : 0;
      }
    }
  };
}

export default withOrientation(SafeView);
