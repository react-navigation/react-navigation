/* @flow */

import React, { Component, PropTypes } from 'react';
import {
  Animated,
  View,
} from 'react-native';
import shallowCompare from 'react-addons-shallow-compare';
import { NavigationStatePropType } from './TabViewPropTypes';
import type { NavigationState, SceneRendererProps } from './TabViewTypeDefinitions';

type Animator = (animatedValue: Animated.Value, toValue: number) => ?Promise<any>

type DefaultProps = {
  configureAnimation: Animator
}

type Props = {
  navigationState: NavigationState;
  render: (props: SceneRendererProps) => ?React.Element<any>;
  configureAnimation: Animator;
  onRequestChangeTab: Function;
  onChangePosition: Function;
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

export default class TabViewTransitioner extends Component<DefaultProps, Props, State> {
  static propTypes = {
    navigationState: NavigationStatePropType.isRequired,
    render: PropTypes.func.isRequired,
    configureAnimation: PropTypes.func.isRequired,
    onRequestChangeTab: PropTypes.func.isRequired,
    onChangePosition: PropTypes.func,
    style: View.propTypes.style,
  };

  static defaultProps = {
    configureAnimation: (position: Animated.Value, toValue: number) => {
      return new Promise(resolve => {
        Animated.spring(position, {
          toValue,
          tension: 300,
          friction: 30,
        }).start(resolve);
      });
    }
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

  componentDidMount() {
    this._positionListener = this.state.position.addListener(this._trackPosition);
  }

  shouldComponentUpdate(nextProps: Props, nextState: State) {
    return shallowCompare(this, nextProps, nextState);
  }

  componentDidUpdate() {
    setTimeout(() => {
      this.props.configureAnimation(this.state.position, this.props.navigationState.index);
    }, 0);
  }

  componentWillUnmount() {
    if (this._positionListener) {
      this.state.position.removeListener(this._positionListener);
    }
  }

  _nextIndex: ?number;
  _lastPosition: ?number;
  _positionListener: ?string;

  _trackPosition = (e: { value: number }) => {
    this._lastPosition = e.value;
    const { onChangePosition } = this.props;
    if (onChangePosition) {
      onChangePosition(e.value);
    }
  };

  _getLastPosition = () => {
    if (typeof this._lastPosition === 'number') {
      return this._lastPosition;
    } else {
      return this.props.navigationState.index;
    }
  };

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

  _buildSceneRendererProps = (): SceneRendererProps => {
    return {
      layout: this.state.layout,
      navigationState: this.props.navigationState,
      position: this.state.position,
      jumpToIndex: this._jumpToIndex,
      getLastPosition: this._getLastPosition,
    };
  }

  _updateIndex = (current: ?number, index: number) => {
    if (this.props.navigationState.index === index) {
      return;
    }
    // Prevent extra setState when index updated mid-transition
    if (current === index) {
      this.props.onRequestChangeTab(index);
    }
  };

  _jumpToIndex = (index: number) => {
    this._nextIndex = index;
    const animation = this.props.configureAnimation(this.state.position, index);
    if (animation) {
      animation.then(() => this._updateIndex(this._nextIndex, index));
    } else {
      this._updateIndex(this._nextIndex, index);
    }
  };

  render() {
    return (
      <View {...this.props} onLayout={this._handleLayout}>
        {this.props.render(this._buildSceneRendererProps())}
      </View>
    );
  }
}
