/* @flow */

import React, { Component, PropTypes } from 'react';
import {
  TouchableNativeFeedback,
  TouchableOpacity,
  Platform,
  View,
} from 'react-native';

const LOLLIPOP = 21;

type Props = {
  delayPressIn: number;
  borderless?: boolean;
  pressColor?: string;
  children?: React.Element<any>;
  style?: any;
}

type DefaultProps = {
  pressColor: string;
}

export default class TouchableItem extends Component<DefaultProps, Props, void> {
  static propTypes = {
    borderless: PropTypes.bool,
    pressColor: PropTypes.string,
    children: PropTypes.node.isRequired,
    style: View.propTypes.style,
  };

  static defaultProps = {
    pressColor: 'rgba(255, 255, 255, .4)',
  };

  render() {
    if (Platform.OS === 'android' && Platform.Version >= LOLLIPOP) {
      return (
        <TouchableNativeFeedback
          {...this.props}
          style={null}
          background={TouchableNativeFeedback.Ripple(this.props.pressColor, this.props.borderless)}
        >
          <View style={this.props.style}>
            {this.props.children}
          </View>
        </TouchableNativeFeedback>
      );
    } else {
      return (
        <TouchableOpacity {...this.props}>
          {this.props.children}
        </TouchableOpacity>
      );
    }
  }
}
