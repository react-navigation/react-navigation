/* @flow */

import * as React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import Animated from 'react-native-reanimated';
import TabBarItem from './TabBarItem';
import TabBarIndicator, {
  type Props as IndicatorProps,
} from './TabBarIndicator';
import type {
  ViewStyleProp,
  TextStyleProp,
} from 'react-native/Libraries/StyleSheet/StyleSheet';
import type {
  Route,
  Scene,
  SceneRendererProps,
  NavigationState,
} from './types';

export type Props<T> = {|
  ...SceneRendererProps,
  navigationState: NavigationState<T>,
  scrollEnabled?: boolean,
  bounces?: boolean,
  activeColor?: string,
  inactiveColor?: string,
  pressColor?: string,
  pressOpacity?: number,
  getLabelText: (scene: Scene<T>) => ?string,
  getAccessible: (scene: Scene<T>) => ?boolean,
  getAccessibilityLabel: (scene: Scene<T>) => ?string,
  getTestID: (scene: Scene<T>) => ?string,
  renderLabel?: (scene: {
    ...Scene<T>,
    focused: boolean,
    color: string,
  }) => React.Node,
  renderIcon?: (scene: {
    ...Scene<T>,
    focused: boolean,
    color: string,
  }) => React.Node,
  renderBadge?: (scene: Scene<T>) => React.Node,
  renderIndicator: (props: IndicatorProps<T>) => React.Node,
  onTabPress?: (scene: Scene<T>) => mixed,
  onTabLongPress?: (scene: Scene<T>) => mixed,
  tabStyle?: ViewStyleProp,
  indicatorStyle?: ViewStyleProp,
  labelStyle?: TextStyleProp,
  contentContainerStyle?: ViewStyleProp,
  style?: ViewStyleProp,
|};

type State = {|
  scrollAmount: Animated.Value,
  initialOffset: ?{| x: number, y: number |},
|};

export default class TabBar<T: Route> extends React.Component<Props<T>, State> {
  static defaultProps = {
    getLabelText: ({ route }: Scene<T>) =>
      typeof route.title === 'string' ? route.title.toUpperCase() : route.title,
    getAccessible: ({ route }: Scene<T>) =>
      typeof route.accessible !== 'undefined' ? route.accessible : true,
    getAccessibilityLabel: ({ route }: Scene<T>) =>
      typeof route.accessibilityLabel === 'string'
        ? route.accessibilityLabel
        : typeof route.title === 'string'
        ? route.title
        : undefined,
    getTestID: ({ route }: Scene<T>) => route.testID,
    renderIndicator: (props: IndicatorProps<T>) => (
      <TabBarIndicator {...props} />
    ),
  };

  constructor(props: Props<T>) {
    super(props);

    const initialOffset =
      this.props.scrollEnabled && this.props.layout.width
        ? {
            x: this._getScrollAmount(
              this.props,
              this.props.navigationState.index
            ),
            y: 0,
          }
        : undefined;

    this.state = {
      scrollAmount: new Animated.Value(0),
      initialOffset,
    };
  }

  componentDidMount() {
    if (this.props.scrollEnabled) {
      this.props.addListener('position', this._adjustScroll);
    }
  }

  componentDidUpdate(prevProps: Props<T>) {
    if (
      prevProps.navigationState.routes.length !==
        this.props.navigationState.routes.length ||
      prevProps.layout.width !== this.props.layout.width
    ) {
      this._resetScroll(this.props.navigationState.index, false);
    } else if (
      prevProps.navigationState.index !== this.props.navigationState.index
    ) {
      this._resetScroll(this.props.navigationState.index);
    }

    if (prevProps.scrollEnabled !== this.props.scrollEnabled) {
      if (this.props.scrollEnabled) {
        this.props.addListener('position', this._adjustScroll);
      } else {
        this.props.removeListener('position', this._adjustScroll);
      }
    }
  }

  componentWillUnmount() {
    this.props.removeListener('position', this._adjustScroll);
  }

  _scrollView: ?ScrollView;
  _isManualScroll: boolean = false;
  _isMomentumScroll: boolean = false;
  _scrollResetCallback: AnimationFrameID;

  _getTabWidth = props => {
    const { layout, navigationState, tabStyle } = props;
    const flattened = StyleSheet.flatten(tabStyle);

    if (flattened) {
      switch (typeof flattened.width) {
        case 'number':
          return flattened.width;
        case 'string':
          if (flattened.width.endsWith('%')) {
            const width = parseFloat(flattened.width);
            if (Number.isFinite(width)) {
              return layout.width * (width / 100);
            }
          }
      }
    }

    if (props.scrollEnabled) {
      return (layout.width / 5) * 2;
    }

    return layout.width / navigationState.routes.length;
  };

  _handleTabLongPress = (scene: Scene<T>) => {
    if (this.props.onTabLongPress) {
      this.props.onTabLongPress(scene);
    }
  };

  _normalizeScrollValue = (props, value) => {
    const { layout, navigationState } = props;
    const tabWidth = this._getTabWidth(props);
    const tabBarWidth = Math.max(
      tabWidth * navigationState.routes.length,
      layout.width
    );
    const maxDistance = tabBarWidth - layout.width;

    return Math.max(Math.min(value, maxDistance), 0);
  };

  _getScrollAmount = (props, i) => {
    const { layout } = props;
    const tabWidth = this._getTabWidth(props);
    const centerDistance = tabWidth * (i + 1 / 2);
    const scrollAmount = centerDistance - layout.width / 2;

    return this._normalizeScrollValue(props, scrollAmount);
  };

  _adjustScroll = (value: number) => {
    if (this.props.scrollEnabled) {
      cancelAnimationFrame(this._scrollResetCallback);

      this._scrollView &&
        this._scrollView.scrollTo({
          x: this._normalizeScrollValue(
            this.props,
            this._getScrollAmount(this.props, value)
          ),
          animated: false,
        });
    }
  };

  _resetScroll = (value: number, animated = true) => {
    if (this.props.scrollEnabled) {
      cancelAnimationFrame(this._scrollResetCallback);

      this._scrollResetCallback = requestAnimationFrame(() => {
        this._scrollView &&
          this._scrollView.scrollTo({
            x: this._getScrollAmount(this.props, value),
            animated,
          });
      });
    }
  };

  _handleBeginDrag = () => {
    // onScrollBeginDrag fires when user touches the ScrollView
    this._isManualScroll = true;
    this._isMomentumScroll = false;
  };

  _handleEndDrag = () => {
    // onScrollEndDrag fires when user lifts his finger
    // onMomentumScrollBegin fires after touch end
    // run the logic in next frame so we get onMomentumScrollBegin first
    requestAnimationFrame(() => {
      if (this._isMomentumScroll) {
        return;
      }
      this._isManualScroll = false;
    });
  };

  _handleMomentumScrollBegin = () => {
    // onMomentumScrollBegin fires on flick, as well as programmatic scroll
    this._isMomentumScroll = true;
  };

  _handleMomentumScrollEnd = () => {
    // onMomentumScrollEnd fires when the scroll finishes
    this._isMomentumScroll = false;
    this._isManualScroll = false;
  };

  render() {
    const {
      position,
      layout,
      navigationState,
      jumpTo,
      addListener,
      removeListener,
      scrollEnabled,
      bounces,
      getAccessibilityLabel,
      getAccessible,
      getLabelText,
      getTestID,
      renderBadge,
      renderIcon,
      renderLabel,
      activeColor,
      inactiveColor,
      pressColor,
      pressOpacity,
      onTabPress,
      onTabLongPress,
      tabStyle,
      labelStyle,
      indicatorStyle,
      contentContainerStyle,
      style,
    } = this.props;
    const { routes } = navigationState;
    const tabWidth = this._getTabWidth(this.props);
    const tabBarWidth = tabWidth * routes.length;
    const translateX = Animated.multiply(this.state.scrollAmount, -1);

    return (
      <Animated.View style={[styles.tabBar, style]}>
        <Animated.View
          pointerEvents="none"
          style={[
            styles.indicatorContainer,
            scrollEnabled
              ? { width: tabBarWidth, transform: [{ translateX }] }
              : null,
          ]}
        >
          {this.props.renderIndicator({
            position,
            layout,
            navigationState,
            jumpTo,
            addListener,
            removeListener,
            width: tabWidth,
            style: indicatorStyle,
          })}
        </Animated.View>
        <View style={styles.scroll}>
          <Animated.ScrollView
            horizontal
            keyboardShouldPersistTaps="handled"
            scrollEnabled={scrollEnabled}
            bounces={bounces}
            alwaysBounceHorizontal={false}
            scrollsToTop={false}
            showsHorizontalScrollIndicator={false}
            automaticallyAdjustContentInsets={false}
            overScrollMode="never"
            contentContainerStyle={[
              styles.tabContent,
              scrollEnabled ? null : styles.container,
              contentContainerStyle,
            ]}
            scrollEventThrottle={16}
            onScroll={Animated.event(
              [
                {
                  nativeEvent: {
                    contentOffset: { x: this.state.scrollAmount },
                  },
                },
              ],
              { useNativeDriver: true }
            )}
            onScrollBeginDrag={this._handleBeginDrag}
            onScrollEndDrag={this._handleEndDrag}
            onMomentumScrollBegin={this._handleMomentumScrollBegin}
            onMomentumScrollEnd={this._handleMomentumScrollEnd}
            contentOffset={this.state.initialOffset}
            ref={el => (this._scrollView = el && el.getNode())}
          >
            {routes.map((route: T) => (
              <TabBarItem
                key={route.key}
                position={position}
                route={route}
                tabWidth={tabWidth}
                navigationState={navigationState}
                scrollEnabled={scrollEnabled}
                getAccessibilityLabel={getAccessibilityLabel}
                getAccessible={getAccessible}
                getLabelText={getLabelText}
                getTestID={getTestID}
                renderBadge={renderBadge}
                renderIcon={renderIcon}
                renderLabel={renderLabel}
                activeColor={activeColor}
                inactiveColor={inactiveColor}
                pressColor={pressColor}
                pressOpacity={pressOpacity}
                onPress={() => {
                  onTabPress && onTabPress({ route });
                  this.props.jumpTo(route.key);
                }}
                onLongPress={() => onTabLongPress && onTabLongPress({ route })}
                labelStyle={labelStyle}
                style={tabStyle}
              />
            ))}
          </Animated.ScrollView>
        </View>
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    overflow: 'scroll',
  },
  tabBar: {
    backgroundColor: '#2196f3',
    elevation: 4,
    shadowColor: 'black',
    shadowOpacity: 0.1,
    shadowRadius: StyleSheet.hairlineWidth,
    shadowOffset: {
      height: StyleSheet.hairlineWidth,
    },
    zIndex: 1,
  },
  tabContent: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
  },
  indicatorContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});
