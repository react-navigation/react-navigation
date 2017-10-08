/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';
import { Animated, Platform, View, StyleSheet } from 'react-native';
import { NavigationStatePropType } from './TabViewPropTypes';
import type {
  Scene,
  SceneRendererProps,
  NavigationState,
  Layout,
  Route,
  SubscriptionName,
  PagerProps,
  Style,
} from './TabViewTypeDefinitions';

type Props<T> = PagerProps & {
  navigationState: NavigationState<T>,
  onIndexChange: (index: number) => void,
  onPositionChange?: ({ value: number }) => void,
  initialLayout?: Layout,
  canJumpToTab?: (route: T) => boolean,
  renderPager: (props: *) => React.Element<any>,
  renderScene: (props: SceneRendererProps<T> & Scene<T>) => ?React.Element<any>,
  renderHeader?: (props: SceneRendererProps<T>) => ?React.Element<any>,
  renderFooter?: (props: SceneRendererProps<T>) => ?React.Element<any>,
  useNativeDriver?: boolean,
  lazy?: boolean,
  style?: Style,
};

type State = {|
  loaded: Array<number>,
  layout: Layout & { measured: boolean },
  layoutXY: Animated.ValueXY,
  panX: Animated.Value,
  offsetX: Animated.Value,
  position: any,
|};

let TabViewPager;

switch (Platform.OS) {
  case 'android':
    TabViewPager = require('./TabViewPagerAndroid').default;
    break;
  case 'ios':
    TabViewPager = require('./TabViewPagerScroll').default;
    break;
  default:
    TabViewPager = require('./TabViewPagerPan').default;
    break;
}

export default class TabViewAnimated<T: Route<*>> extends React.Component<
  Props<T>,
  State
> {
  static propTypes = {
    navigationState: NavigationStatePropType.isRequired,
    onIndexChange: PropTypes.func.isRequired,
    onPositionChange: PropTypes.func,
    initialLayout: PropTypes.shape({
      height: PropTypes.number.isRequired,
      width: PropTypes.number.isRequired,
    }),
    canJumpToTab: PropTypes.func,
    renderPager: PropTypes.func.isRequired,
    renderScene: PropTypes.func.isRequired,
    renderHeader: PropTypes.func,
    renderFooter: PropTypes.func,
    lazy: PropTypes.bool,
  };

  static defaultProps = {
    renderPager: props => <TabViewPager {...props} />,
    initialLayout: {
      height: 0,
      width: 0,
    },
    useNativeDriver: false,
  };

  constructor(props: Props<T>) {
    super(props);

    const { navigationState } = this.props;
    const layout = {
      ...this.props.initialLayout,
      measured: false,
    };

    const panX = new Animated.Value(0);
    const offsetX = new Animated.Value(-navigationState.index * layout.width);
    const layoutXY = new Animated.ValueXY({
      x: layout.width || 0.001,
      y: layout.height || 0.001,
    });
    const position = Animated.multiply(
      Animated.divide(Animated.add(panX, offsetX), layoutXY.x),
      -1
    );

    this.state = {
      loaded: [navigationState.index],
      layout,
      layoutXY,
      panX,
      offsetX,
      position,
    };
  }

  componentDidMount() {
    this._mounted = true;
    this._panXListener = this.state.panX.addListener(this._trackPanX);
    this._offsetXListener = this.state.offsetX.addListener(this._trackOffsetX);
  }

  componentWillUnmount() {
    this._mounted = false;
    this.state.panX.removeListener(this._panXListener);
    this.state.offsetX.removeListener(this._offsetXListener);
  }

  _mounted: boolean = false;
  _nextIndex: ?number;
  _lastPanX: ?number;
  _lastOffsetX: ?number;
  _panXListener: string;
  _offsetXListener: string;
  _subscriptions: { [key: SubscriptionName]: Array<Function> } = {};

  _trackPanX = e => {
    this._lastPanX = e.value;
    this._trackPosition();
  };

  _trackOffsetX = e => {
    this._lastOffsetX = e.value;
    this._trackPosition();
  };

  _trackPosition = () => {
    const value = this._getLastPosition();
    this._handlePositionChange(value);
    this._triggerEvent('position', value);
  };

  _getLastPosition = () => {
    const { navigationState } = this.props;
    const { layout } = this.state;

    const panX = typeof this._lastPanX === 'number' ? this._lastPanX : 0;
    const offsetX =
      typeof this._lastOffsetX === 'number'
        ? this._lastOffsetX
        : -navigationState.index * layout.width;

    return (panX + offsetX) / -(layout.width || 0.001);
  };

  _renderScene = (props: SceneRendererProps<T> & Scene<T>) => {
    const { renderScene, lazy } = this.props;
    const { navigationState } = props;
    const { loaded } = this.state;
    if (lazy) {
      if (loaded.includes(navigationState.routes.indexOf(props.route))) {
        return renderScene(props);
      }
      return null;
    }
    return renderScene(props);
  };

  _handlePositionChange = (value: number) => {
    const { onPositionChange, navigationState, lazy } = this.props;
    if (onPositionChange) {
      onPositionChange({ value });
    }
    const { loaded } = this.state;
    if (lazy) {
      let next = Math.ceil(value);
      if (next === navigationState.index) {
        next = Math.floor(value);
      }
      if (loaded.includes(next)) {
        return;
      }
      this.setState({
        loaded: [...loaded, next],
      });
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

    this.state.offsetX.setValue(-this.props.navigationState.index * width);
    this.state.layoutXY.setValue({ x: width, y: height });
    this.setState({
      layout: {
        measured: true,
        height,
        width,
      },
    });
  };

  _buildSceneRendererProps = (): SceneRendererProps<*> => ({
    layout: this.state.layout,
    navigationState: this.props.navigationState,
    position: this.state.position,
    jumpToIndex: this._jumpToIndex,
    getLastPosition: this._getLastPosition,
    subscribe: this._addSubscription,
    useNativeDriver: this.props.useNativeDriver === true,
  });

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
      this.props.onIndexChange(index);
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
    const {
      /* eslint-disable no-unused-vars */
      navigationState,
      onIndexChange,
      onPositionChange,
      canJumpToTab,
      lazy,
      initialLayout,
      renderScene,
      /* eslint-enable no-unused-vars */
      renderPager,
      renderHeader,
      renderFooter,
      ...rest
    } = this.props;
    const props = this._buildSceneRendererProps();

    return (
      <View
        onLayout={this._handleLayout}
        loaded={this.state.loaded}
        style={[styles.container, this.props.style]}
      >
        {renderHeader && renderHeader(props)}
        {renderPager({
          ...props,
          ...rest,
          panX: this.state.panX,
          offsetX: this.state.offsetX,
          children: navigationState.routes.map((route, index) =>
            this._renderScene({
              ...props,
              route,
              index,
              focused: index === navigationState.index,
            })
          ),
        })}
        {renderFooter && renderFooter(props)}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
  },
});
