/* @flow */

import React, { Component, PropTypes } from 'react';
import {
  Animated,
  PanResponder,
  StyleSheet,
  View,
} from 'react-native';
import shallowCompare from 'react-addons-shallow-compare';
import TabViewPanResponder from './TabViewPanResponder';
import TabViewStyleInterpolator from './TabViewStyleInterpolator';
import { SceneRendererPropType } from './TabViewPropTypes';
import type { Scene, SceneRendererProps } from './TabViewTypeDefinitions';

const styles = StyleSheet.create({
  page: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
});

type Props = SceneRendererProps & {
  scene: Scene;
  renderScene: (props: { scene: Scene; focused: boolean; }) => ?React.Element<any>;
  panHandlers?: any;
  style?: any;
}

export default class TabViewPage extends Component<void, Props, void> {
  static propTypes = {
    ...SceneRendererPropType,
    renderScene: PropTypes.func.isRequired,
    panHandlers: PropTypes.object,
    style: View.propTypes.style,
  };

  static PanResponder = TabViewPanResponder;
  static StyleInterpolator = TabViewStyleInterpolator;

  shouldComponentUpdate(nextProps: Props, nextState: void) {
    return shallowCompare(this, nextProps, nextState);
  }

  render() {
    const { renderScene, panHandlers, style, scene } = this.props;
    const { scenes, index } = this.props.navigationState;

    const viewPanHandlers = typeof panHandlers !== 'undefined' ? panHandlers : TabViewPanResponder.forSwipe(this.props);
    const viewStyle = typeof style !== 'undefined' ? style : TabViewStyleInterpolator.forSwipe(this.props);

    return (
      <Animated.View style={[ styles.page, viewStyle ]} {...PanResponder.create(viewPanHandlers).panHandlers}>
        {renderScene({ scene, focused: index === scenes.indexOf(scene) })}
      </Animated.View>
    );
  }
}
