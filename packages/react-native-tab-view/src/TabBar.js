/* @flow */

import React, { PureComponent, PropTypes } from 'react';
import {
  Animated,
  StyleSheet,
  View,
  Text,
  ScrollView,
  Platform,
} from 'react-native';
import TouchableItem from './TouchableItem';
import { SceneRendererPropType } from './TabViewPropTypes';
import type { Scene, SceneRendererProps } from './TabViewTypeDefinitions';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    overflow: Platform.OS === 'web' ? 'auto' : 'scroll',
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
  tabLabel: {
    backgroundColor: 'transparent',
    color: 'white',
    margin: 8,
  },
  tabItem: {
    flexGrow: 1,
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

type IndicatorProps = SceneRendererProps & {
  width: Animated.Value;
}

type ScrollEvent = {
  nativeEvent: {
    contentOffset: {
      x: number;
    };
  };
}

type DefaultProps = {
  getLabelText: (scene: Scene) => ?string;
}

type Props = SceneRendererProps & {
  scrollEnabled?: boolean;
  pressColor?: string;
  pressOpacity?: number;
  getLabelText: (scene: Scene) => ?string;
  renderLabel?: (scene: Scene) => ?React.Element<*>;
  renderIcon?: (scene: Scene) => ?React.Element<*>;
  renderBadge?: (scene: Scene) => ?React.Element<*>;
  renderIndicator?: (props: IndicatorProps) => ?React.Element<*>;
  onTabPress?: Function;
  tabStyle?: any;
  indicatorStyle?: any;
  labelStyle?: any;
  style?: any;
}

type State = {
  offset: Animated.Value;
  visibility: Animated.Value;
}

export default class TabBar extends PureComponent<DefaultProps, Props, State> {
  static propTypes = {
    ...SceneRendererPropType,
    scrollEnabled: PropTypes.bool,
    pressColor: TouchableItem.propTypes.pressColor,
    pressOpacity: TouchableItem.propTypes.pressOpacity,
    getLabelText: PropTypes.func,
    renderIcon: PropTypes.func,
    renderLabel: PropTypes.func,
    renderIndicator: PropTypes.func,
    onTabPress: PropTypes.func,
    tabStyle: View.propTypes.style,
    indicatorStyle: View.propTypes.style,
    labelStyle: Text.propTypes.style,
    style: PropTypes.any,
  };

  static defaultProps = {
    getLabelText: ({ route }) => route.title ? route.title.toUpperCase() : null,
  };

  state: State = {
    offset: new Animated.Value(0),
    visibility: new Animated.Value(0),
  };

  componentWillMount() {
    if (this.props.scrollEnabled === true) {
      const tabWidth = this._getTabWidthFromStyle(this.props.tabStyle);
      if (this.props.layout.width || tabWidth) {
        this.state.visibility.setValue(1);
      }
    } else {
      this.state.visibility.setValue(1);
    }
  }

  componentDidMount() {
    this._adjustScroll(this.props.navigationState.index);
    this._positionListener = this.props.subscribe('position', this._adjustScroll);
  }

  componentWillReceiveProps(nextProps: Props) {
    if (this.props.navigationState !== nextProps.navigationState) {
      this._resetScrollOffset(nextProps);
    }

    const nextTabWidth = this._getTabWidthFromStyle(nextProps.tabStyle);

    if (
        (this.props.tabStyle !== nextProps.tabStyle && nextTabWidth) ||
        (this.props.layout.width !== nextProps.layout.width && nextProps.layout.width)
     ) {
      this.state.visibility.setValue(1);
    }
  }

  componentDidUpdate(prevProps: Props) {
    if (this.props.scrollEnabled && (prevProps.layout !== this.props.layout || prevProps.tabStyle !== this.props.tabStyle)) {
      global.requestAnimationFrame(() =>
        this._adjustScroll(this.props.navigationState.index)
      );
    }
  }

  componentWillUnmount() {
    this._positionListener.remove();
  }

  _positionListener: Object;
  _scrollView: Object;
  _isManualScroll: boolean = false;
  _isMomentumScroll: boolean = false;

  _renderLabel = (scene: Scene) => {
    if (typeof this.props.renderLabel !== 'undefined') {
      return this.props.renderLabel(scene);
    }
    const label = this.props.getLabelText(scene);
    if (typeof label !== 'string') {
      return null;
    }
    return <Text style={[ styles.tabLabel, this.props.labelStyle ]}>{label}</Text>;
  }

  _renderIndicator = (props: IndicatorProps) => {
    if (typeof this.props.renderIndicator !== 'undefined') {
      return this.props.renderIndicator(props);
    }
    const { width, position } = props;
    const translateX = Animated.multiply(position, width);
    return (
      <Animated.View
        style={[ styles.indicator, { width, transform: [ { translateX } ] }, this.props.indicatorStyle ]}
      />
    );
  };

  _tabWidthCache: ?{ style: any; width: ?number };

  _getTabWidthFromStyle = (style: any) => {
    if (this._tabWidthCache && this._tabWidthCache.style === style) {
      return this._tabWidthCache.width;
    }
    const passedTabStyle = StyleSheet.flatten(this.props.tabStyle);
    const cache = { style, width: passedTabStyle ? passedTabStyle.width : null };
    this._tabWidthCache = cache;
    return cache;
  }

  _getFinalTabWidth = (props: Props) => {
    const { layout, navigationState } = props;
    const tabWidth = this._getTabWidthFromStyle(props.tabStyle);
    if (typeof tabWidth === 'number') {
      return tabWidth;
    }
    if (typeof tabWidth === 'string' && tabWidth.endsWith('%')) {
      return layout.width * (parseFloat(tabWidth, 10) / 100);
    }
    if (props.scrollEnabled) {
      return (layout.width / 5) * 2;
    }
    return layout.width / navigationState.routes.length;
  };

  _getMaxScrollableDistance = (props: Props) => {
    const { layout, navigationState } = props;
    if (layout.width === 0) {
      return 0;
    }
    const finalTabWidth = this._getFinalTabWidth(props);
    const tabBarWidth = finalTabWidth * navigationState.routes.length;
    const maxDistance = tabBarWidth - layout.width;
    return Math.max(maxDistance, 0);
  };

  _normalizeScrollValue = (props: Props, value: number) => {
    const maxDistance = this._getMaxScrollableDistance(props);
    return Math.max(Math.min(value, maxDistance), 0);
  };

  _getScrollAmount = (props: Props, i: number) => {
    const { layout } = props;
    const finalTabWidth = this._getFinalTabWidth(props);
    const centerDistance = (finalTabWidth * i) + (finalTabWidth / 2);
    const scrollAmount = centerDistance - (layout.width / 2);
    return this._normalizeScrollValue(props, scrollAmount);
  };

  _resetScrollOffset = (props: Props) => {
    if (!props.scrollEnabled || !this._scrollView) {
      return;
    }

    const scrollAmount = this._getScrollAmount(props, props.navigationState.index);
    this._scrollView.scrollTo({
      x: scrollAmount,
      animated: true,
    });
    Animated.timing(this.state.offset, {
      toValue: 0,
      duration: 150,
    }).start();
  };

  _adjustScroll = (index: number) => {
    if (!this.props.scrollEnabled || !this._scrollView) {
      return;
    }

    const scrollAmount = this._getScrollAmount(this.props, index);
    this._scrollView.scrollTo({
      x: scrollAmount,
      animated: false,
    });
  };

  _adjustOffset = (value: number) => {
    if (!this._isManualScroll || !this.props.scrollEnabled) {
      return;
    }

    const scrollAmount = this._getScrollAmount(this.props, this.props.navigationState.index);
    const scrollOffset = value - scrollAmount;

    if (this._isMomentumScroll) {
      Animated.spring(this.state.offset, {
        toValue: -scrollOffset,
        tension: 300,
        friction: 35,
      }).start();
    } else {
      this.state.offset.setValue(-scrollOffset);
    }
  };

  _handleScroll = (e: ScrollEvent) => {
    this._adjustOffset(e.nativeEvent.contentOffset.x);
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

  _setRef = (el: Object) => (this._scrollView = el);

  render() {
    const { position, navigationState, scrollEnabled } = this.props;
    const { routes, index } = navigationState;
    const initialOffset = this._getScrollAmount(this.props, this.props.navigationState.index);
    const maxDistance = this._getMaxScrollableDistance(this.props);
    const finalTabWidth = this._getFinalTabWidth(this.props);
    const tabBarWidth = finalTabWidth * routes.length;

    // Prepend '-1', so there are always at least 2 items in inputRange
    const inputRange = [ -1, ...routes.map((x, i) => i) ];
    const translateOutputRange = inputRange.map(i => this._getScrollAmount(this.props, i) * -1);

    const translateX = Animated.add(
      position.interpolate({
        inputRange,
        outputRange: translateOutputRange,
      }),
      this.state.offset
    ).interpolate({
      inputRange: [ -maxDistance, 0 ],
      outputRange: ([ -maxDistance, 0 ]: Array<number>),
      extrapolate: 'clamp',
    });

    return (
      <Animated.View style={[ styles.tabBar, this.props.style ]}>
        <Animated.View pointerEvents='none' style={[ styles.indicatorContainer, scrollEnabled ? { width: tabBarWidth, transform: [ { translateX } ] } : null ]}>
          {this._renderIndicator({
            ...this.props,
            width: new Animated.Value(finalTabWidth),
          })}
        </Animated.View>
        <View style={styles.scroll}>
          <ScrollView
            horizontal
            scrollEnabled={scrollEnabled}
            bounces={false}
            alwaysBounceHorizontal={false}
            scrollsToTop={false}
            showsHorizontalScrollIndicator={false}
            automaticallyAdjustContentInsets={false}
            contentContainerStyle={[ styles.tabContent, scrollEnabled ? null : styles.container ]}
            scrollEventThrottle={16}
            onScroll={this._handleScroll}
            onScrollBeginDrag={this._handleBeginDrag}
            onScrollEndDrag={this._handleEndDrag}
            onMomentumScrollBegin={this._handleMomentumScrollBegin}
            onMomentumScrollEnd={this._handleMomentumScrollEnd}
            contentOffset={{ x: initialOffset, y: 0 }}
            ref={this._setRef}
          >
            {routes.map((route, i) => {
              const focused = index === i;
              const outputRange = inputRange.map(inputIndex => inputIndex === i ? 1 : 0.7);
              const opacity = Animated.multiply(this.state.visibility, position.interpolate({
                inputRange,
                outputRange,
              }));
              const scene = {
                route,
                focused,
                index: i,
              };
              const label = this._renderLabel(scene);
              const icon = this.props.renderIcon ? this.props.renderIcon(scene) : null;
              const badge = this.props.renderBadge ? this.props.renderBadge(scene) : null;

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
              const isWidthSet = (passedTabStyle && typeof passedTabStyle.width !== 'undefined') || scrollEnabled === true;
              const tabContainerStyle = {};

              if (isWidthSet) {
                tabStyle.width = finalTabWidth;
              }

              if (passedTabStyle && typeof passedTabStyle.flex === 'number') {
                tabContainerStyle.flex = passedTabStyle.flex;
              } else if (!isWidthSet) {
                tabContainerStyle.flex = 1;
              }

              const accessibilityLabel = route.accessibilityLabel || route.title;

              return (
                <TouchableItem
                  borderless
                  key={route.key}
                  testID={route.testID}
                  accessible={route.accessible}
                  accessibilityLabel={accessibilityLabel}
                  accessibilityTraits='button'
                  pressColor={this.props.pressColor}
                  pressOpacity={this.props.pressOpacity}
                  delayPressIn={0}
                  onPress={() => { // eslint-disable-line react/jsx-no-bind
                    const { onTabPress, jumpToIndex } = this.props;
                    jumpToIndex(i);
                    if (onTabPress) {
                      onTabPress(routes[i]);
                    }
                  }}
                  style={tabContainerStyle}
                >
                  <View style={styles.container}>
                    <Animated.View style={[ styles.tabItem, tabStyle, passedTabStyle, styles.container ]}>
                      {icon}
                      {label}
                    </Animated.View>
                    {badge ?
                      <Animated.View style={[ styles.badge, { opacity: this.state.visibility } ]}>
                        {badge}
                      </Animated.View> : null
                    }
                  </View>
                </TouchableItem>
              );
            })}
          </ScrollView>
        </View>
      </Animated.View>
    );
  }
}
