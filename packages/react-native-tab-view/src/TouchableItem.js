/* @flow */

import React, { PureComponent, Children, PropTypes } from 'react';
import {
  TouchableNativeFeedback,
  TouchableOpacity,
  Platform,
  View,
} from 'react-native';

const LOLLIPOP = 21;

type Props = {
  delayPressIn?: number;
  borderless?: boolean;
  pressColor?: string;
  pressOpacity?: number;
  children?: React.Element<*>;
  style?: any;
}

type DefaultProps = {
  pressColor: string;
}

export default class TouchableItem extends PureComponent<DefaultProps, Props, void> {
  static propTypes = {
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

  render() {
    const { style, pressOpacity, pressColor, borderless, ...rest } = this.props;

    if (Platform.OS === 'android' && Platform.Version >= LOLLIPOP) {
      return (
        <TouchableNativeFeedback
          {...rest}
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
          style={style}
          activeOpacity={pressOpacity}
        >
          {this.props.children}
        </TouchableOpacity>
      );
    }
  }
}
