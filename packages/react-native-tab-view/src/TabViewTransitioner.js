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
  layout: {
    measured: boolean;
    width: number;
    height: number;
  };
  position: Animated.Value;
}

export default class TabViewTransitioner extends Component<void, Props, State> {
  static propTypes = {
    navigationState: NavigationStatePropType.isRequired,
    render: PropTypes.func.isRequired,
    onRequestChangeTab: PropTypes.func.isRequired,
    style: View.propTypes.style,
  };

  constructor(props: Props) {
    super(props);

    this.state = {
      layout: {
        measured: false,
        width: 0,
        height: 0,
      },
      position: new Animated.Value(this.props.navigationState.index),
    };
  }

  state: State;

  shouldComponentUpdate(nextProps: Props, nextState: State) {
    return shallowCompare(this, nextProps, nextState);
  }

  componentDidUpdate() {
    setTimeout(() => {
      this._updatePosition(this.props.navigationState.index);
    }, 0);
  }

  _currentIndex: number;

  _handleLayout = (e: any) => {
    const { height, width } = e.nativeEvent.layout;

    this.setState({
      layout: {
        measured: true,
        height,
        width,
      },
    });
  };

  _updatePosition = (index: number, callback: ?Function) => {
    const { position } = this.state;
    Animated.spring(position, {
      toValue: index,
      tension: 300,
      friction: 30,
    }).start(callback);
  };

  _jumpToIndex = (index: number) => {
    this._currentIndex = index;
    this._updatePosition(index, () => {
      // Prevent unnecessary setState when index is the same
      if (this.props.navigationState.index === index) {
        return;
      }
      // Prevent extra setState when index updated mid-transition
      if (this._currentIndex === index) {
        this.props.onRequestChangeTab(index);
      }
    });
  };

  render() {
    const sceneRendererProps: SceneRendererProps = {
      layout: this.state.layout,
      navigationState: this.props.navigationState,
      position: this.state.position,
      jumpToIndex: this._jumpToIndex,
    };

    return (
      <View {...this.props} onLayout={this._handleLayout}>
        {this.props.render(sceneRendererProps)}
      </View>
    );
  }
}
