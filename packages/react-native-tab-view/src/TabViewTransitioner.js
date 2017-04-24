/* @flow */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Animated, View } from 'react-native';
import { NavigationStatePropType } from './TabViewPropTypes';
import type {
  SubscriptionName,
  SceneRendererProps,
  Layout,
} from './TabViewTypeDefinitions';
import type { TransitionerProps } from './TabViewTransitionerTypes';

type DefaultProps = {
  initialLayout: Layout,
};

type Props = TransitionerProps & {
  render: (props: SceneRendererProps) => ?React.Element<*>,
  style?: any,
};

type State = {
  layout: Layout & {
    measured: boolean,
  },
  position: Animated.Value,
};

export default class TabViewTransitioner
  extends PureComponent<DefaultProps, Props, State> {
  static propTypes = {
    navigationState: NavigationStatePropType.isRequired,
    render: PropTypes.func.isRequired,
    onRequestChangeTab: PropTypes.func.isRequired,
    onChangePosition: PropTypes.func,
    initialLayout: PropTypes.shape({
      height: PropTypes.number.isRequired,
      width: PropTypes.number.isRequired,
    }),
    canJumpToTab: PropTypes.func,
    style: View.propTypes.style,
  };

  static defaultProps = {
    initialLayout: {
      height: 0,
      width: 0,
    },
  };

  constructor(props: Props) {
    super(props);

    this.state = {
      layout: {
        ...this.props.initialLayout,
        measured: false,
      },
      position: new Animated.Value(this.props.navigationState.index),
    };
  }

  state: State;

  componentDidMount() {
    this._mounted = true;
    this._positionListener = this.state.position.addListener(
      this._trackPosition,
    );
  }

  componentWillUnmount() {
    this._mounted = false;
    this.state.position.removeListener(this._positionListener);
  }

  _mounted: boolean = false;
  _nextIndex: ?number;
  _lastPosition: ?number;
  _positionListener: string;
  _subscriptions: { [key: SubscriptionName]: Array<Function> } = {};

  _trackPosition = (e: { value: number }) => {
    this._triggerEvent('position', e.value);
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

    if (
      this.state.layout.width === width &&
      this.state.layout.height === height
    ) {
      return;
    }

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
      subscribe: this._addSubscription,
    };
  };

  _jumpToIndex = (index: number) => {
    if (!this._mounted) {
      // We are no longer mounted, this is a no-op
      return;
    }

    const { canJumpToTab, navigationState } = this.props;

    if (canJumpToTab && !canJumpToTab(navigationState.routes[index])) {
      this._triggerEvent('reset', navigationState.index);
      return;
    }

    if (index !== navigationState.index) {
      this.props.onRequestChangeTab(index);
    }
  };

  _addSubscription = (event: SubscriptionName, callback: Function) => {
    if (!this._subscriptions[event]) {
      this._subscriptions[event] = [];
    }
    this._subscriptions[event].push(callback);
    return {
      remove: () => {
        const index = this._subscriptions[event].indexOf(callback);
        if (index > -1) {
          this._subscriptions[event].splice(index, 1);
        }
      },
    };
  };

  _triggerEvent = (event: SubscriptionName, value: any) => {
    if (this._subscriptions[event]) {
      this._subscriptions[event].forEach(fn => fn(value));
    }
  };

  render() {
    return (
      <View style={this.props.style} onLayout={this._handleLayout}>
        {this.props.render(this._buildSceneRendererProps())}
      </View>
    );
  }
}
