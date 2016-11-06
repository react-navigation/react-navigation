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
import type { SceneRendererProps } from './TabViewTypeDefinitions';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
  },

  sheet: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'stretch',
  },
});

type DefaultProps = {
  swipeDistanceThreshold: number;
  swipeVelocityThreshold: number;
}

type Props = SceneRendererProps & {
  swipeEnabled?: boolean;
  swipeDistanceThreshold: number;
  swipeVelocityThreshold: number;
  children?: any;
}

export default class TabViewPagerPan extends Component<DefaultProps, Props, void> {
  static propTypes = {
    ...SceneRendererPropType,
    swipeEnabled: PropTypes.bool,
    swipeDistanceThreshold: PropTypes.number.isRequired,
    swipeVelocityThreshold: PropTypes.number.isRequired,
    children: PropTypes.node,
  };

  static defaultProps = {
    swipeDistanceThreshold: 120,
    swipeVelocityThreshold: 0.25,
  };

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
    if (this.props.swipeEnabled === false) {
      this._panHandlers = null;
    } else {
      this._panHandlers = TabViewPanResponder.forHorizontal(props);
    }
  };

  _callResponderMethod = (methodName: string, returnValue: any) => (...args: Array<*>) => {
    const panHandlers = this._panHandlers;
    if (panHandlers && panHandlers[methodName]) {
      return panHandlers[methodName](...args);
    }
    return returnValue;
  };

  _panHandlers: any;
  _panResponder: any;

  render() {
    const { navigationState, layout } = this.props;
    const { routes } = navigationState;

    const style = TabViewStyleInterpolator.forHorizontal(this.props);

    return (
      <View style={styles.container}>
        <Animated.View style={[ styles.sheet, style, { width: layout.width * routes.length } ]} {...this._panResponder.panHandlers}>
          {this.props.children}
        </Animated.View>
      </View>
    );
  }
}
