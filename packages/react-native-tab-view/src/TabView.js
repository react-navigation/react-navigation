/* @flow */

import React, { Component, PropTypes } from 'react';
import {
  Animated,
  PanResponder,
  StyleSheet,
  View,
} from 'react-native';
import shallowCompare from 'react-addons-shallow-compare';
import TabViewScene from './TabViewScene';
import TabViewPanResponder from './TabViewPanResponder';
import TabViewStyle from './TabViewStyle';
import { SceneRendererPropType } from './TabViewPropTypes';
import type { Scene, SceneRendererProps } from './TabViewTypes';

const styles = StyleSheet.create({
  inner: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'nowrap',
  },
});

type Props = SceneRendererProps & {
  renderScene: (props: { scene: Scene; focused: boolean; }) => ?React.Element<any>;
  panHandlers?: any;
  style?: any;
}

export default class TabViewAnimated extends Component<void, Props, void> {
  static propTypes = {
    ...SceneRendererPropType,
    renderScene: PropTypes.func.isRequired,
    panHandlers: PropTypes.object,
    style: View.propTypes.style,
  };

  static PanResponder = TabViewPanResponder;
  static Style = TabViewStyle;

  shouldComponentUpdate(nextProps: Props, nextState: void) {
    return shallowCompare(this, nextProps, nextState);
  }

  componentDidUpdate() {
    this.props.updateIndex(this.props.navigationState.index);
  }

  render() {
    const { renderScene, panHandlers, style, ...sceneRendererProps } = this.props;
    const { width } = sceneRendererProps;
    const { scenes, index } = sceneRendererProps.navigationState;

    const viewPanHandlers = typeof panHandlers !== 'undefined' ? panHandlers : TabViewPanResponder.forSwipe(sceneRendererProps);
    const viewStyle = typeof style !== 'undefined' ? style : TabViewStyle.forSwipe(sceneRendererProps);

    return (
      <Animated.View style={[ styles.inner, viewStyle ]} {...PanResponder.create(viewPanHandlers).panHandlers}>
        {scenes.map((scene, i) => {
          return (
            <TabViewScene
              key={scene.key}
              scene={scene}
              focused={index === i}
              left={i * width}
              width={width}
              renderScene={renderScene}
            />
          );
        })}
      </Animated.View>
    );
  }
}
