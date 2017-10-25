import React, { Component } from 'react';
import {
  DeviceInfo,
  Dimensions,
  NativeModules,
  SafeAreaView,
  View,
} from 'react-native';
import withOrientation from './withOrientation';

const { isIPhoneX_deprecated } = DeviceInfo;
const X_WIDTH = 375;
const X_HEIGHT = 812;

const { minor } = NativeModules.PlatformConstants.reactNativeVersion;

const isIPhoneX = (() => {
  if (minor >= 50) {
    return isIPhoneX_deprecated;
  }

  const { height, width } = Dimensions.get('window');
  return height === X_HEIGHT && width === X_WIDTH;
})();

console.log(minor, isIPhoneX);

class SafeView extends Component {
  state = {
    touchesTop: true,
    touchesBottom: true,
    touchesLeft: true,
    touchesRight: true,
    orientation: null,
  };

  render() {
    const { forceInset = false, isLandscape, children, style } = this.props;

    if (!isIPhoneX) {
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

  _onLayout = ({ nativeEvent: { layout: { x, y, width, height } } }) => {
    const { isLandscape } = this.props;
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

      const touchesTop = realY === 0;
      const touchesBottom = realY + height >= HEIGHT;
      const touchesLeft = realX === 0;
      const touchesRight = realX + width >= WIDTH;

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
      paddingTop: touchesTop ? (isLandscape ? 0 : 44) : 0,
      paddingBottom: touchesBottom ? (isLandscape ? 24 : 34) : 0,
      paddingLeft: touchesLeft ? (isLandscape ? 44 : 0) : 0,
      paddingRight: touchesRight ? (isLandscape ? 44 : 0) : 0,
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
        return isLandscape ? 44 : 0;
      }
      case 'vertical':
      case 'top': {
        return isLandscape ? 0 : 44;
      }
      case 'bottom': {
        return isLandscape ? 24 : 34;
      }
    }
  };
}

export default withOrientation(SafeView);
