/* @flow */

import React, { Component, PropTypes } from 'react';
import {
  Animated,
  Easing,
  View,
} from 'react-native';
import shallowCompare from 'react-addons-shallow-compare';
import { NavigationStatePropType } from './TabViewPropTypes';
import type { NavigationState, SceneRendererProps } from './TabViewTypes';

type Props = {
  navigationState: NavigationState;
  renderScene: (props: SceneRendererProps) => ?React.Element;
  renderHeader?: () => ?React.Element;
  renderFooter?: () => ?React.Element;
  onRequestChangeTab: Function;
  style?: any;
}

type State = {
  width: number;
  height: number;
  positionAnim: Animated.Value;
}

export default class TabViewTransitioner extends Component<void, Props, State> {
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
    positionAnim: new Animated.Value(0),
  };

  shouldComponentUpdate(nextProps: Props, nextState: State) {
    return shallowCompare(this, nextProps, nextState);
  }

  _handleLayout = (e: any) => {
    const { height, width } = e.nativeEvent.layout;

    this.setState({
      height,
      width,
    });
  };

  _calculateLeftOffset = (index: number) => {
    const { width } = this.state;

    return width * index * -1;
  };

  _updatePosition = () => {
    const { index } = this.props.navigationState;
    const { positionAnim } = this.state;
    const offsetLeft = this._calculateLeftOffset(index);
    Animated.timing(positionAnim, {
      toValue: offsetLeft,
      duration: 250,
    }).start();
  };

  _updateIndex = (index: number) => {
    if (this.props.navigationState.index === index) {
      return;
    }

    this.props.onRequestChangeTab(index);

    setTimeout(() => this._updatePosition(), 0);
  };

  render() {
    const sceneRendererProps: SceneRendererProps = {
      width: this.state.width,
      navigationState: this.props.navigationState,
      offset: this._calculateLeftOffset(this.props.navigationState.index),
      position: this.state.positionAnim,
      updateIndex: this._updateIndex,
      updatePosition: this._updatePosition,
    };

    return (
      <View {...this.props} onLayout={this._handleLayout}>
        {this.props.renderHeader && this.props.renderHeader(sceneRendererProps)}
        {this.props.renderScene && this.props.renderScene(sceneRendererProps)}
        {this.props.renderFooter && this.props.renderFooter(sceneRendererProps)}
      </View>
    );
  }
}
