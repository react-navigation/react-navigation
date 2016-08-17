/* @flow */

import React, { Component, PropTypes } from 'react';
import {
  Animated,
  InteractionManager,
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
    this._callbackId++;
    const currentId = this._callbackId;
    InteractionManager.runAfterInteractions(() => {
      if (currentId === this._callbackId) {
        this._updatePanHandlers(nextProps);
      }
    });
  }

  shouldComponentUpdate(nextProps: Props, nextState: State) {
    return shallowCompare(this, nextProps, nextState);
  }

  componentWillUnmount() {
    this._callbackId++;
  }

  _callbackId: number = 0;

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
