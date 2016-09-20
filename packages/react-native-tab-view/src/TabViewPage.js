/* @flow */

import React, { Component, PropTypes } from 'react';
import {
  Animated,
  PanResponder,
  StyleSheet,
  View,
} from 'react-native';
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

export default class TabViewPage extends Component<void, Props, void> {
  static propTypes = {
    ...SceneRendererPropType,
    renderScene: PropTypes.func.isRequired,
    panHandlers: PropTypes.object,
    style: PropTypes.any,
  };

  static PanResponder = TabViewPanResponder;
  static StyleInterpolator = TabViewStyleInterpolator;

  componentWillMount() {
    this._setPanHandlers(this.props);

    // We need this mess to maintain a single panResponder
    // We can't update the panResponder mid-gesture
    // Otherwise it'll never release the InteractionManager handle
    // Which will cause InteractionManager.runAfterInteractions callbacks to never fire
    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (...args) => {
        return this._callResponderMethod('onStartShouldSetPanResponder', false)(...args);
      },
      onStartShouldSetPanResponderCapture: (...args) => {
        return this._callResponderMethod('onStartShouldSetPanResponderCapture', false)(...args);
      },
      onMoveShouldSetPanResponder: (...args) => {
        return this._callResponderMethod('onMoveShouldSetPanResponder', false)(...args);
      },
      onMoveShouldSetPanResponderCapture: (...args) => {
        return this._callResponderMethod('onMoveShouldSetPanResponderCapture', false)(...args);
      },
      onPanResponderReject: (...args) => {
        this._callResponderMethod('onPanResponderReject', null)(...args);
      },
      onPanResponderGrant: (...args) => {
        this._callResponderMethod('onPanResponderGrant', null)(...args);
      },
      onPanResponderStart: (...args) => {
        this._callResponderMethod('onPanResponderStart', null)(...args);
      },
      onPanResponderEnd: (...args) => {
        this._callResponderMethod('onPanResponderEnd', null)(...args);
      },
      onPanResponderRelease: (...args) => {
        this._callResponderMethod('onPanResponderRelease', null)(...args);
      },
      onPanResponderMove: (...args) => {
        this._callResponderMethod('onPanResponderMove', null)(...args);
      },
      onPanResponderTerminate: (...args) => {
        this._callResponderMethod('onPanResponderTerminate', null)(...args);
      },
      onPanResponderTerminationRequest: (...args) => {
        return this._callResponderMethod('onPanResponderTerminationRequest', true)(...args);
      },
      onShouldBlockNativeResponder: (...args) => {
        return this._callResponderMethod('onShouldBlockNativeResponder', false)(...args);
      },
    });
  }

  componentWillReceiveProps(nextProps: Props) {
    this._setPanHandlers(nextProps);
  }

  _setPanHandlers = (props: Props) => {
    const { panHandlers } = props;
    this._panHandlers = typeof panHandlers !== 'undefined' ? panHandlers : TabViewPanResponder.forHorizontal(props);
  };

  _callResponderMethod = (methodName: string, returnValue: any) => (...args: Array<any>) => {
    const panHandlers = this._panHandlers;
    if (panHandlers && panHandlers[methodName]) {
      return panHandlers[methodName](...args);
    }
    return returnValue;
  };

  _panHandlers: any;
  _panResponder: any;

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
      <Animated.View style={[ StyleSheet.absoluteFill, viewStyle ]} {...this._panResponder.panHandlers}>
        {renderScene(scene)}
      </Animated.View>
    );
  }
}
