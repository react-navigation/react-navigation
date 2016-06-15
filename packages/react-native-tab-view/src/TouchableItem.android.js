/* @flow */

import React, { Component, PropTypes } from 'react';
import {
  TouchableNativeFeedback,
  View,
} from 'react-native';

export default class TouchableItem extends Component<void, any, void> {
  static propTypes = {
    style: View.propTypes.style,
    children: PropTypes.node,
  };

  render() {
    return (
      <TouchableNativeFeedback {...this.props} style={null}>
        <View style={this.props.style}>
          {this.props.children}
        </View>
      </TouchableNativeFeedback>
    );
  }
}
