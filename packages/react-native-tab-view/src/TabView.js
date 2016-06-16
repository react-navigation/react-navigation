/* @flow */

import React, { Component, PropTypes } from 'react';
import {
  Animated,
  StyleSheet,
  View,
  PanResponder,
} from 'react-native';
import { NavigationStatePropType } from './TabViewPropTypes';
import type { Scene, NavigationState } from './TabViewTypes';
import type { GestureEvent, GestureState } from './PanResponderTypes';

const styles = StyleSheet.create({
  inner: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'nowrap',
  },
  page: {
    position: 'absolute',
    top: 0,
    bottom: 0,
  },
});

type Props = {
  navigationState: NavigationState;
  renderScene: (props: { scene: Scene; focused: boolean; }) => ?React.Element;
  renderHeader?: () => ?React.Element;
  renderFooter?: () => ?React.Element;
  onRequestChangeTab: Function;
  style?: any;
}

type State = {
  width: number;
  height: number;
  translateAnim: Animated.Value;
}

export default class TabView extends Component<void, Props, State> {
  static propTypes = {
    navigationState: NavigationStatePropType.isRequired,
    renderScene: PropTypes.func.isRequired,
    renderHeader: PropTypes.func,
    renderFooter: PropTypes.func,
    onRequestChangeTab: PropTypes.func.isRequired,
    style: View.propTypes.style,
  };

  state: State = {
    width: 0,
    height: 0,
    translateAnim: new Animated.Value(0),
  };

  componentDidUpdate() {
    this._updatePosition();
  }

  _panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (evt: GestureEvent, gestureState: GestureState) => {
      return this._canMoveScreen(evt, gestureState);
    },
    onMoveShouldSetPanResponderCapture: (evt: GestureEvent, gestureState: GestureState) => {
      return this._canMoveScreen(evt, gestureState);
    },
    onPanResponderMove: (evt: GestureEvent, gestureState: GestureState) => {
      this._respondToGesture(evt, gestureState);
    },
    onPanResponderTerminationRequest: () => true,
    onPanResponderRelease: (evt: GestureEvent, gestureState: GestureState) => {
      this._finishGesture(evt, gestureState);
    },
    onPanResponderTerminate: (evt: GestureEvent, gestureState: GestureState) => {
      this._finishGesture(evt, gestureState);
    },
  });

  _vx: ?number;

  _calculateLeftOffset = () => {
    const { index } = this.props.navigationState;
    const { width } = this.state;

    return width * index * -1;
  };

  _getNextIndex = (evt: GestureEvent, gestureState: GestureState) => {
    const { scenes, index } = this.props.navigationState;
    if (Math.abs(gestureState.dx) > (this.state.width / 5)) {
      const nextIndex = index - (gestureState.dx / Math.abs(gestureState.dx));
      if (nextIndex >= 0 && nextIndex < scenes.length) {
        return nextIndex;
      }
    }
    return index;
  };

  _canMoveScreen = (evt: GestureEvent, gestureState: GestureState) => {
    const { scenes, index } = this.props.navigationState;
    return (
      (Math.abs(gestureState.dx) > Math.abs(gestureState.dy)) &&
      (gestureState.dx > 0 && index !== 0) ||
      (gestureState.dx < 0 && index !== scenes.length - 1)
    );
  };

  _respondToGesture = (evt: GestureEvent, gestureState: GestureState) => {
    if (this._canMoveScreen(evt, gestureState)) {
      const offsetLeft = this._calculateLeftOffset() + gestureState.dx;
      this.state.translateAnim.setValue(offsetLeft);
    }
  };

  _finishGesture = (evt: GestureEvent, gestureState: GestureState) => {
    const { index } = this.props.navigationState;
    const { translateAnim } = this.state;
    const nextIndex = this._getNextIndex(evt, gestureState);
    if (index !== nextIndex) {
      this._vx = gestureState.vx;
      this.props.onRequestChangeTab(nextIndex);
    } else {
      this._updatePosition();
    }
  };

  _updatePosition = () => {
    const { translateAnim } = this.state;
    const offsetLeft = this._calculateLeftOffset();

    Animated.timing(translateAnim, {
      toValue: offsetLeft,
      duration: this._vx ? Math.max(Math.abs(this._vx), 1) * 100 : 350,
    }).start();
    this._vx = null;
  };

  _handleLayout = (e: any) => {
    const { height, width } = e.nativeEvent.layout;

    this.setState({
      height,
      width,
    });
  };

  render() {
    const { scenes, index } = this.props.navigationState;
    const { width, translateAnim } = this.state;

    return (
      <View
        {...this.props}
        {...this._panResponder.panHandlers}
        onLayout={this._handleLayout}
      >
        {this.props.renderHeader && this.props.renderHeader()}
        <Animated.View style={[ styles.inner, { width: width * scenes.length, transform: [ { translateX: translateAnim } ] } ]}>
          {scenes.map((scene, i) => {
            return (
              <View key={scene.key} style={[ styles.page, { left: i * width, width } ]}>
                {this.props.renderScene({
                  scene,
                  focused: index === i,
                })}
              </View>
            );
          })}
        </Animated.View>
        {this.props.renderFooter && this.props.renderFooter()}
      </View>
    );
  }
}
