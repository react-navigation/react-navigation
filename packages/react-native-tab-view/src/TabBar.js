/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';
import {
  Animated,
  NativeModules,
  StyleSheet,
  View,
  ScrollView,
  Platform,
  I18nManager,
} from 'react-native';
import TouchableItem from './TouchableItem';
import { SceneRendererPropType } from './PropTypes';
import type { Scene, SceneRendererProps } from './TypeDefinitions';
import type {
  ViewStyleProp,
  TextStyleProp,
} from 'react-native/Libraries/StyleSheet/StyleSheet';

type IndicatorProps<T> = SceneRendererProps<T> & {
  width: number,
};

type Props<T> = SceneRendererProps<T> & {
  scrollEnabled?: boolean,
  bounces?: boolean,
  pressColor?: string,
  pressOpacity?: number,
  getLabelText: (scene: Scene<T>) => ?string,
  getAccessible: (scene: Scene<T>) => ?boolean,
  getAccessibilityLabel: (scene: Scene<T>) => ?string,
  getTestID: (scene: Scene<T>) => ?string,
  renderLabel?: (scene: Scene<T>) => React.Node,
  renderIcon?: (scene: Scene<T>) => React.Node,
  renderBadge?: (scene: Scene<T>) => React.Node,
  renderIndicator?: (props: IndicatorProps<T>) => React.Node,
  onTabPress?: (scene: Scene<T>) => mixed,
  onTabLongPress?: (scene: Scene<T>) => mixed,
  tabStyle?: ViewStyleProp,
  indicatorStyle?: ViewStyleProp,
  labelStyle?: TextStyleProp,
  style?: ViewStyleProp,
};

type State = {|
  visibility: Animated.Value,
  scrollAmount: Animated.Value,
  initialOffset: ?{| x: number, y: number |},
|};

const useNativeDriver = Boolean(NativeModules.NativeAnimatedModule);

export default class TabBar<T: *> extends React.Component<Props<T>, State> {
  static propTypes = {
    ...SceneRendererPropType,
    scrollEnabled: PropTypes.bool,
    bounces: PropTypes.bool,
    pressColor: TouchableItem.propTypes.pressColor,
    pressOpacity: TouchableItem.propTypes.pressOpacity,
    getLabelText: PropTypes.func,
    getAccessible: PropTypes.func,
    getAccessibilityLabel: PropTypes.func,
    getTestID: PropTypes.func,
    renderIcon: PropTypes.func,
    renderLabel: PropTypes.func,
    renderIndicator: PropTypes.func,
    onTabPress: PropTypes.func,
    onTabLongPress: PropTypes.func,
    labelStyle: PropTypes.any,
    style: PropTypes.any,
  };

  static defaultProps = {
    getLabelText: ({ route }: Scene<T>) =>
      typeof route.title === 'string' ? route.title.toUpperCase() : route.title,
    getAccessible: ({ route }: Scene<T>) =>
      typeof route.accessible !== 'undefined' ? route.accessible : true,
    getAccessibilityLabel: ({ route }: Scene<T>) => route.accessibilityLabel,
    getTestID: ({ route }: Scene<T>) => route.testID,
  };

  constructor(props: Props<T>) {
    super(props);

    let initialVisibility = 1;

    if (this.props.scrollEnabled) {
      const tabWidth = this._getTabWidth(this.props);
      if (!tabWidth) {
        initialVisibility = 0;
      }
    }

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
      visibility: new Animated.Value(initialVisibility),
      scrollAmount: new Animated.Value(0),
      initialOffset,
    };
  }

  componentDidMount() {
    this.props.scrollEnabled && this._startTrackingPosition();
  }

  componentDidUpdate(prevProps: Props<T>) {
    const prevTabWidth = this._getTabWidth(prevProps);
    const currentTabWidth = this._getTabWidth(this.props);
    const pendingIndex =
      typeof this._pendingIndex === 'number'
        ? this._pendingIndex
        : this.props.navigationState.index;

    this._pendingIndex = null;

    if (prevTabWidth !== currentTabWidth && currentTabWidth) {
      this.state.visibility.setValue(1);
    }

    if (
      prevProps.navigationState.routes.length !==
        this.props.navigationState.routes.length ||
      prevProps.layout.width !== this.props.layout.width
    ) {
      this._resetScroll(this.props.navigationState.index, false);
    } else if (prevProps.navigationState.index !== pendingIndex) {
      this._resetScroll(this.props.navigationState.index);
    }
  }

  componentWillUnmount() {
    this._stopTrackingPosition();
  }

  _scrollView: ?ScrollView;
  _isIntial: boolean = true;
  _isManualScroll: boolean = false;
  _isMomentumScroll: boolean = false;
  _pendingIndex: ?number;
  _scrollResetCallback: any;
  _lastPanX: ?number;
  _lastOffsetX: ?number;
  _panXListener: string;
  _offsetXListener: string;

  _startTrackingPosition = () => {
    this._offsetXListener = this.props.offsetX.addListener(({ value }) => {
      this._lastOffsetX = value;
      this._handlePosition();
    });
    this._panXListener = this.props.panX.addListener(({ value }) => {
      this._lastPanX = value;
      this._handlePosition();
    });
  };

  _stopTrackingPosition = () => {
    this.props.offsetX.removeListener(this._offsetXListener);
    this.props.panX.removeListener(this._panXListener);
  };

  _handlePosition = () => {
    const { navigationState, layout } = this.props;

    if (layout.width === 0) {
      // Don't do anything if we don't have layout yet
      return;
    }

    const panX = typeof this._lastPanX === 'number' ? this._lastPanX : 0;
    const offsetX =
      typeof this._lastOffsetX === 'number'
        ? this._lastOffsetX
        : -navigationState.index * layout.width;

    const value = (panX + offsetX) / -(layout.width || 0.001);

    this._adjustScroll(value);
  };

  _renderLabel = (scene: Scene<*>) => {
    if (typeof this.props.renderLabel !== 'undefined') {
      return this.props.renderLabel(scene);
    }
    const label = this.props.getLabelText(scene);
    if (typeof label !== 'string') {
      return null;
    }
    return (
      <Animated.Text style={[styles.tabLabel, this.props.labelStyle]}>
        {label}
      </Animated.Text>
    );
  };

  _renderIndicator = (props: IndicatorProps<T>) => {
    if (typeof this.props.renderIndicator !== 'undefined') {
      return this.props.renderIndicator(props);
    }
    const { width, position, navigationState } = props;
    const translateX = Animated.multiply(
      Animated.multiply(
        position.interpolate({
          inputRange: [0, navigationState.routes.length - 1],
          outputRange: [0, navigationState.routes.length - 1],
          extrapolate: 'clamp',
        }),
        width
      ),
      I18nManager.isRTL ? -1 : 1
    );
    return (
      <Animated.View
        style={[
          styles.indicator,
          { width, transform: [{ translateX }] },
          this.props.indicatorStyle,
        ]}
      />
    );
  };

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

  _handleTabPress = ({ route }: Scene<*>) => {
    this._pendingIndex = this.props.navigationState.routes.indexOf(route);

    if (this.props.onTabPress) {
      this.props.onTabPress({ route });
    }

    this.props.jumpTo(route.key);
  };

  _handleTabLongPress = ({ route }: Scene<*>) => {
    if (this.props.onTabLongPress) {
      this.props.onTabLongPress({ route });
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
      global.cancelAnimationFrame(this._scrollResetCallback);
      this._scrollView &&
        this._scrollView.scrollTo({
          x: this._normalizeScrollValue(
            this.props,
            this._getScrollAmount(this.props, value)
          ),
          animated: !this._isIntial, // Disable animation for the initial render
        });

      this._isIntial = false;
    }
  };

  _resetScroll = (value: number, animated = true) => {
    if (this.props.scrollEnabled) {
      global.cancelAnimationFrame(this._scrollResetCallback);
      this._scrollResetCallback = global.requestAnimationFrame(() => {
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
    global.requestAnimationFrame(() => {
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
    const { position, navigationState, scrollEnabled, bounces } = this.props;
    const { routes } = navigationState;
    const tabWidth = this._getTabWidth(this.props);
    const tabBarWidth = tabWidth * routes.length;

    // Prepend '-1', so there are always at least 2 items in inputRange
    const inputRange = [-1, ...routes.map((x, i) => i)];
    const translateX = Animated.multiply(this.state.scrollAmount, -1);

    return (
      <Animated.View style={[styles.tabBar, this.props.style]}>
        <Animated.View
          pointerEvents="none"
          style={[
            styles.indicatorContainer,
            scrollEnabled
              ? { width: tabBarWidth, transform: [{ translateX }] }
              : null,
          ]}
        >
          {this._renderIndicator({
            ...this.props,
            width: tabWidth,
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
            ]}
            scrollEventThrottle={1}
            onScroll={Animated.event(
              [
                {
                  nativeEvent: {
                    contentOffset: { x: this.state.scrollAmount },
                  },
                },
              ],
              { useNativeDriver }
            )}
            onScrollBeginDrag={this._handleBeginDrag}
            onScrollEndDrag={this._handleEndDrag}
            onMomentumScrollBegin={this._handleMomentumScrollBegin}
            onMomentumScrollEnd={this._handleMomentumScrollEnd}
            contentOffset={this.state.initialOffset}
            ref={el => (this._scrollView = el && el.getNode())}
          >
            {routes.map((route, i) => {
              const outputRange = inputRange.map(
                inputIndex => (inputIndex === i ? 1 : 0.7)
              );
              const opacity = Animated.multiply(
                this.state.visibility,
                position.interpolate({
                  inputRange,
                  outputRange,
                })
              );
              const label = this._renderLabel({ route });
              const icon = this.props.renderIcon
                ? this.props.renderIcon({ route })
                : null;
              const badge = this.props.renderBadge
                ? this.props.renderBadge({ route })
                : null;

              const tabStyle = {};

              tabStyle.opacity = opacity;

              if (icon) {
                if (label) {
                  tabStyle.paddingTop = 8;
                } else {
                  tabStyle.padding = 12;
                }
              }

              const passedTabStyle = StyleSheet.flatten(this.props.tabStyle);
              const isWidthSet =
                (passedTabStyle &&
                  typeof passedTabStyle.width !== 'undefined') ||
                scrollEnabled === true;
              const tabContainerStyle = {};

              if (isWidthSet) {
                tabStyle.width = tabWidth;
              }

              if (passedTabStyle && typeof passedTabStyle.flex === 'number') {
                tabContainerStyle.flex = passedTabStyle.flex;
              } else if (!isWidthSet) {
                tabContainerStyle.flex = 1;
              }

              let accessibilityLabel = this.props.getAccessibilityLabel({
                route,
              });

              accessibilityLabel =
                typeof accessibilityLabel !== 'undefined'
                  ? accessibilityLabel
                  : this.props.getLabelText({ route });

              const isFocused = i === navigationState.index;

              return (
                <TouchableItem
                  borderless
                  key={route.key}
                  testID={this.props.getTestID({ route })}
                  accessible={this.props.getAccessible({ route })}
                  accessibilityLabel={accessibilityLabel}
                  accessibilityTraits={
                    isFocused ? ['button', 'selected'] : 'button'
                  }
                  accessibilityComponentType="button"
                  pressColor={this.props.pressColor}
                  pressOpacity={this.props.pressOpacity}
                  delayPressIn={0}
                  onPress={() => this._handleTabPress({ route })}
                  onLongPress={() => this._handleTabLongPress({ route })}
                  style={tabContainerStyle}
                >
                  <View pointerEvents="none" style={styles.container}>
                    <Animated.View
                      style={[
                        styles.tabItem,
                        tabStyle,
                        passedTabStyle,
                        styles.container,
                      ]}
                    >
                      {icon}
                      {label}
                    </Animated.View>
                    {badge ? (
                      <Animated.View
                        style={[
                          styles.badge,
                          { opacity: this.state.visibility },
                        ]}
                      >
                        {badge}
                      </Animated.View>
                    ) : null}
                  </View>
                </TouchableItem>
              );
            })}
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
    overflow: Platform.OS === 'web' ? ('auto': any) : 'scroll',
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
    // We don't need zIndex on Android, disable it since it's buggy
    zIndex: Platform.OS === 'android' ? 0 : 1,
  },
  tabContent: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
  },
  tabLabel: {
    backgroundColor: 'transparent',
    color: 'white',
    margin: 8,
  },
  tabItem: {
    flex: 1,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: 0,
    right: 0,
  },
  indicatorContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  indicator: {
    backgroundColor: '#ffeb3b',
    position: 'absolute',
    left: 0,
    bottom: 0,
    right: 0,
    height: 2,
  },
});
