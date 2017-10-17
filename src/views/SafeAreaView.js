import React, { Component } from 'react';
import { DeviceInfo, SafeAreaView, View } from 'react-native';
import withOrientation from './withOrientation';

const { isIPhoneX_deprecated: isIPhoneX } = DeviceInfo;
const DEVICE_WIDTH = 375;
const DEVICE_HEIGHT = 812;

class SafeView extends Component {
  state = {
    touchesTop: true,
    touchesBottom: true,
    touchesLeft: true,
    touchesRight: true,
  };

  defaultSafeAreaStyle = () => {
    const { touchesTop, touchesBottom, touchesLeft, touchesRight } = this.state;
    const { isLandscape } = this.props;

    return {
      paddingTop: touchesTop ? (isLandscape ? 0 : 44) : 0,
      paddingBottom: touchesBottom ? (isLandscape ? 24 : 34) : 0,
      paddingLeft: touchesLeft ? (isLandscape ? 44 : 0) : 0,
      paddingRight: touchesRight ? (isLandscape ? 44 : 0) : 0,
    };
  };

  render() {
    const { insetOverride, isLandscape, children, style } = this.props;

    if (!isIPhoneX) {
      return <View style={style}>{this.props.children}</View>;
    }

    const safeAreaStyle = this.defaultSafeAreaStyle();

    if (insetOverride) {
      Object.keys(insetOverride).forEach(key => {
        switch (key) {
          case 'horizontal': {
            safeAreaStyle.paddingLeft = insetOverride[key];
            safeAreaStyle.paddingRight = insetOverride[key];
            break;
          }
          case 'vertical': {
            safeAreaStyle.paddingTop = insetOverride[key];
            safeAreaStyle.paddingBottom = insetOverride[key];
            break;
          }
          case 'left': {
            safeAreaStyle.paddingLeft = insetOverride[key];
            break;
          }
          case 'right': {
            safeAreaStyle.paddingRight = insetOverride[key];
            break;
          }
          case 'top': {
            safeAreaStyle.paddingTop = insetOverride[key];
            break;
          }
          case 'bottom': {
            safeAreaStyle.paddingBottom = insetOverride[key];
            break;
          }
        }
      });
    }

    return (
      <View onLayout={this._onLayout} style={[style, safeAreaStyle]}>
        {this.props.children}
      </View>
    );
  }

  _onLayout = ({ nativeEvent: { layout: { x, y, width, height } } }) => {
    const { isLandscape, verbose } = this.props;

    const WIDTH = isLandscape ? DEVICE_HEIGHT : DEVICE_WIDTH;
    const HEIGHT = isLandscape ? DEVICE_WIDTH : DEVICE_HEIGHT;

    const touchesTop = y === 0;
    const touchesBottom = y + height === HEIGHT;
    const touchesLeft = x === 0;
    const touchesRight = x + width === WIDTH;

    if (verbose) {
      console.log(isLandscape, y, height, y + height, HEIGHT);
    }

    this.setState({ touchesTop, touchesBottom, touchesLeft, touchesRight });
  };
}

export default withOrientation(SafeView);
