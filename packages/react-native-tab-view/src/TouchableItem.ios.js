/* @flow */

import React, { Component, PropTypes } from 'react';
import {
  TouchableOpacity,
} from 'react-native';

export default class TouchableItem extends Component<void, any, void> {
  static propTypes = {
    children: PropTypes.node,
  };

  render() {
    return (
      <TouchableOpacity {...this.props}>
        {this.props.children}
      </TouchableOpacity>
    );
  }
}
