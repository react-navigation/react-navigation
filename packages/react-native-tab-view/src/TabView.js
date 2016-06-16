/* @flow */

import React, { Component, PropTypes } from 'react';
import {
  Animated,
  Easing,
  StyleSheet,
  View,
  PanResponder,
} from 'react-native';
import shallowCompare from 'react-addons-shallow-compare';
import TabViewScene from './TabViewScene';
import { NavigationStatePropType } from './TabViewPropTypes';
import type { Scene, NavigationState } from './TabViewTypes';
import type { GestureEvent, GestureState } from './PanResponderTypes';

const styles = StyleSheet.create({
  inner: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'nowrap',
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

  shouldComponentUpdate(nextProps: Props, nextState: State) {
    return shallowCompare(this, nextProps, nextState);
  }

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

  _calculateLeftOffset = (index: number) => {
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
    const { index } = this.props.navigationState;
    const offsetLeft = this._calculateLeftOffset(index) + gestureState.dx;
    this.state.translateAnim.setValue(offsetLeft);
  };

  _finishGesture = (evt: GestureEvent, gestureState: GestureState) => {
    const { index } = this.props.navigationState;
    const { translateAnim } = this.state;
    const nextIndex = this._getNextIndex(evt, gestureState);
    if (index !== nextIndex) {
      const offsetLeft = this._calculateLeftOffset(nextIndex);
      Animated.timing(translateAnim, {
        toValue: offsetLeft,
        duration: 350 - Math.abs(gestureState.vx) * 10,
        easing: Easing.easeInOut,
      }).start(() => {
        this.props.onRequestChangeTab(nextIndex);
        this._updatePosition();
      });
    } else {
      this._updatePosition();
    }
  };

  _updatePosition = () => {
    const { index } = this.props.navigationState;
    const { translateAnim } = this.state;
    const offsetLeft = this._calculateLeftOffset(index);
    Animated.timing(translateAnim, {
      toValue: offsetLeft,
    }).start();
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
              <TabViewScene
                key={scene.key}
                scene={scene}
                focused={index === i}
                left={i * width}
                width={width}
                renderScene={this.props.renderScene}
              />
            );
          })}
        </Animated.View>
        {this.props.renderFooter && this.props.renderFooter()}
      </View>
    );
  }
}
