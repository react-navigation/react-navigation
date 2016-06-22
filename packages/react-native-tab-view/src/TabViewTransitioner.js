/* @flow */

import React, { Component, PropTypes } from 'react';
import {
  Animated,
  View,
} from 'react-native';
import shallowCompare from 'react-addons-shallow-compare';
import { NavigationStatePropType } from './TabViewPropTypes';
import type { NavigationState, SceneRendererProps } from './TabViewTypeDefinitions';

type Props = {
  navigationState: NavigationState;
  render: (props: SceneRendererProps) => ?React.Element<any>;
  onRequestChangeTab: Function;
  style?: any;
}

type State = {
  width: number;
  height: number;
  position: Animated.Value;
}

export default class TabViewTransitioner extends Component<void, Props, State> {
  static propTypes = {
    navigationState: NavigationStatePropType.isRequired,
    render: PropTypes.func.isRequired,
    onRequestChangeTab: PropTypes.func.isRequired,
    style: View.propTypes.style,
  };

  state: State = {
    width: 0,
    height: 0,
    position: new Animated.Value(0),
  };

  shouldComponentUpdate(nextProps: Props, nextState: State) {
    return shallowCompare(this, nextProps, nextState);
  }

  componentDidUpdate() {
    setTimeout(() => {
      this._updatePosition(this.props.navigationState.index);
    }, 0);
  }

  _handleLayout = (e: any) => {
    const { height, width } = e.nativeEvent.layout;

    this.setState({
      height,
      width,
    });
  };

  _updatePosition = (index: number) => {
    const { position } = this.state;
    Animated.spring(position, {
      toValue: index,
      tension: 300,
      friction: 30,
    }).start();
  };

  _updateIndex = (index: number) => {
    if (this.props.navigationState.index !== index) {
      this.props.onRequestChangeTab(index);
    }

    this._updatePosition(index);
  };

  render() {
    const sceneRendererProps: SceneRendererProps = {
      width: this.state.width,
      navigationState: this.props.navigationState,
      position: this.state.position,
      updateIndex: this._updateIndex,
    };

    return (
      <View {...this.props} onLayout={this._handleLayout}>
        {this.props.render(sceneRendererProps)}
      </View>
    );
  }
}
