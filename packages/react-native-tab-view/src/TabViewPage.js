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
import type { Route, Scene, SceneRendererProps } from './TabViewTypeDefinitions';

type Props = SceneRendererProps & {
  route: Route;
  renderScene: (scene: Scene) => ?React.Element<any>;
  panHandlers?: any;
  style?: any;
}

type State = {
  panHandlers: any;
}

export default class TabViewPage extends Component<void, Props, State> {
  static propTypes = {
    ...SceneRendererPropType,
    renderScene: PropTypes.func.isRequired,
    panHandlers: PropTypes.object,
    style: PropTypes.any,
  };

  static PanResponder = TabViewPanResponder;
  static StyleInterpolator = TabViewStyleInterpolator;

  state: State = {
    panHandlers: null,
  };

  componentWillMount() {
    this._updatePanHandlers(this.props);
  }

  componentWillReceiveProps(nextProps: Props) {
    // Only update panHandlers when navigation state changes
    // We can't update the panHandlers mid-gesture
    // Otherwise it'll never release the InteractionManager handle
    // Which will cause InteractionManager.runAfterInteractions callbacks to never fire
    if (this.props.navigationState !== nextProps.navigationState) {
      this._updatePanHandlers(nextProps);
    }
  }

  shouldComponentUpdate(nextProps: Props, nextState: State) {
    return shallowCompare(this, nextProps, nextState);
  }

  _updatePanHandlers = (props: Props) => {
    const { panHandlers } = props;
    const viewPanHandlers = typeof panHandlers !== 'undefined' ? panHandlers : TabViewPanResponder.forHorizontal(props);
    this.setState({
      panHandlers: viewPanHandlers ? PanResponder.create(viewPanHandlers).panHandlers : null,
    });
  };

  render() {
    const { navigationState, renderScene, style, route } = this.props;
    const { routes, index } = navigationState;

    const viewStyle = typeof style !== 'undefined' ? style : TabViewStyleInterpolator.forHorizontal(this.props);
    const scene = {
      route,
      focused: index === routes.indexOf(route),
      index: routes.indexOf(route),
    };

    return (
      <Animated.View style={[ StyleSheet.absoluteFill, viewStyle ]} {...this.state.panHandlers}>
        {renderScene(scene)}
      </Animated.View>
    );
  }
}
