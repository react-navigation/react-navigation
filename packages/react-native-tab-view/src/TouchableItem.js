/* @flow */

import React, { PureComponent, Children } from 'react';
import PropTypes from 'prop-types';
import {
  TouchableNativeFeedback,
  TouchableOpacity,
  Platform,
  View,
} from 'react-native';
import type { Style } from './TabViewTypeDefinitions';

const LOLLIPOP = 21;

type Props = {
  onPress: Function,
  delayPressIn?: number,
  borderless?: boolean,
  pressColor?: string,
  pressOpacity?: number,
  children?: React.Element<any>,
  style?: Style,
};

type DefaultProps = {
  pressColor: string,
};

export default class TouchableItem
  extends PureComponent<DefaultProps, Props, void> {
  static propTypes = {
    onPress: PropTypes.func.isRequired,
    delayPressIn: PropTypes.number,
    borderless: PropTypes.bool,
    pressColor: PropTypes.string,
    pressOpacity: PropTypes.number,
    children: PropTypes.node.isRequired,
    style: View.propTypes.style,
  };

  static defaultProps = {
    pressColor: 'rgba(255, 255, 255, .4)',
  };

  _handlePress = () => {
    global.requestAnimationFrame(this.props.onPress);
  };

  render() {
    const { style, pressOpacity, pressColor, borderless, ...rest } = this.props;

    if (Platform.OS === 'android' && Platform.Version >= LOLLIPOP) {
      return (
        <TouchableNativeFeedback
          {...rest}
          onPress={this._handlePress}
          background={TouchableNativeFeedback.Ripple(pressColor, borderless)}
        >
          <View style={style}>
            {Children.only(this.props.children)}
          </View>
        </TouchableNativeFeedback>
      );
    } else {
      return (
        <TouchableOpacity
          {...rest}
          onPress={this._handlePress}
          style={style}
          activeOpacity={pressOpacity}
        >
          {this.props.children}
        </TouchableOpacity>
      );
    }
  }
}
