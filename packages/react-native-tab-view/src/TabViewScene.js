/* @flow */

import React, { Component, PropTypes } from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';
import shallowCompare from 'react-addons-shallow-compare';
import { NavigationScenePropType } from './TabViewPropTypes';
import type { Scene } from './TabViewTypes';

const styles = StyleSheet.create({
  page: {
    position: 'absolute',
    top: 0,
    bottom: 0,
  },
});

type Props = {
  scene: Scene;
  focused: boolean;
  left: number;
  width: number;
  renderScene: (props: { scene: Scene; focused: boolean; }) => ?React.Element;
}

export default class TabViewScene extends Component<void, Props, void> {
  static propTypes = {
    scene: NavigationScenePropType.isRequired,
    focused: PropTypes.bool.isRequired,
    left: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired,
    renderScene: PropTypes.func.isRequired,
  };

  shouldComponentUpdate(nextProps: Props, nextState: void) {
    return shallowCompare(this, nextProps, nextState);
  }

  render() {
    const {
      scene,
      focused,
      left,
      width,
      renderScene,
    } = this.props;

    return (
      <View style={[ styles.page, { left, width } ]}>
        {renderScene({
          scene,
          focused,
        })}
      </View>
    );
  }
}
