/* @flow */

import React, { Component, PropTypes } from 'react';
import {
  Animated,
  StyleSheet,
  View,
  Text,
  ScrollView,
} from 'react-native';
import TouchableItem from './TouchableItem';
import { SceneRendererPropType } from './TabViewPropTypes';
import type { Scene, SceneRendererProps } from './TabViewTypeDefinitions';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabbar: {
    backgroundColor: 'black',
    elevation: 4,
    shadowColor: 'black',
    shadowOpacity: 0.1,
    shadowRadius: StyleSheet.hairlineWidth,
    shadowOffset: {
      height: StyleSheet.hairlineWidth,
    },
    zIndex: 1,
  },
  tabcontent: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
  },
  tablabel: {
    backgroundColor: 'transparent',
    color: 'white',
    fontSize: 12,
    margin: 4,
  },
  tab: {
    flex: 1,
  },
  tabitem: {
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
  indiator: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});

type IndicatorProps = SceneRendererProps & {
  width: number;
}

type ScrollEvent = {
  nativeEvent: {
    contentOffset: {
      x: number;
    };
  };
}

type DefaultProps = {
  renderLabel: (scene: Scene) => ?React.Element<any>;
}

type Props = SceneRendererProps & {
  scrollEnabled?: boolean;
  pressColor?: string;
  renderLabel?: (scene: Scene) => ?React.Element<any>;
  renderIcon?: (scene: Scene) => ?React.Element<any>;
  renderBadge?: (scene: Scene) => ?React.Element<any>;
  renderIndicator?: (props: IndicatorProps) => ?React.Element<any>;
  onTabPress?: Function;
  tabWidth: ?number;
  tabStyle?: any;
  style?: any;
}

type State = {
  offset: Animated.Value;
}

export default class TabBar extends Component<DefaultProps, Props, State> {
  static propTypes = {
    ...SceneRendererPropType,
    scrollEnabled: PropTypes.bool,
    pressColor: TouchableItem.propTypes.pressColor,
    renderIcon: PropTypes.func,
    renderLabel: PropTypes.func,
    renderIndicator: PropTypes.func,
    onTabPress: PropTypes.func,
    tabWidth: PropTypes.number,
    tabStyle: View.propTypes.style,
    style: View.propTypes.style,
  };

  static defaultProps = {
    renderLabel: ({ route }) => route.title ? <Text style={styles.tablabel}>{route.title}</Text> : null,
  };

  state: State = {
    offset: new Animated.Value(0),
  };

  componentDidMount() {
    this._adjustScroll(this.props.navigationState.index);
    this._positionListener = this.props.subscribe('position', this._adjustScroll);
  }

  componentWillReceiveProps(nextProps: Props) {
    if (this.props.navigationState !== nextProps.navigationState) {
      this._resetScrollOffset(nextProps);
    }
  }

  componentWillUnmount() {
    this._positionListener.remove();
  }

  _positionListener: Object;
  _scrollView: Object;
  _scrollOffset: number = 0;
  _isManualScroll: boolean = false;
  _isMomentumScroll: boolean = false;

  _getTabWidth = (props: Props) => {
    const { layout, tabWidth } = props;
    if (typeof tabWidth === 'number') {
      return tabWidth;
    }
    return (layout.width / 5) * 2;
  };

  _getMaxScrollableDistance = (props: Props) => {
    const tabWidth = this._getTabWidth(props);
    const { layout, navigationState } = props;
    const maxDistance = (tabWidth * navigationState.routes.length) - layout.width;
    return Math.max(maxDistance, 0);
  };

  _normalizeScrollValue = (props: Props, value: number) => {
    const maxDistance = this._getMaxScrollableDistance(props);
    return Math.max(Math.min(value, maxDistance), 0);
  };

  _getScrollAmount = (props: Props, i: number) => {
    const { layout } = props;
    const tabWidth = this._getTabWidth(props);
    const centerDistance = (tabWidth * i) + (tabWidth / 2);
    const scrollAmount = centerDistance - (layout.width / 2);
    return this._normalizeScrollValue(props, scrollAmount);
  };

  _resetScrollOffset = (props: Props) => {
    if (this._scrollOffset === 0 || !props.scrollEnabled || !this._scrollView) {
      return;
    }

    const scrollAmount = this._getScrollAmount(props, props.navigationState.index);
    this._scrollOffset = 0;
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

    const scrollAmount = this._getScrollAmount(this.props, index) + this._scrollOffset;
    this._scrollView.scrollTo({
      x: this._normalizeScrollValue(this.props, scrollAmount),
      animated: false,
    });
  };

  _adjustOffset = (value: number) => {
    if (!this._isManualScroll || !this.props.scrollEnabled) {
      return;
    }

    const scrollAmount = this._getScrollAmount(this.props, this.props.navigationState.index);
    const scrollOffset = value - scrollAmount;
    this._scrollOffset = scrollOffset;

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
    const { position, layout, navigationState, scrollEnabled } = this.props;
    const { routes, index } = navigationState;
    const maxDistance = this._getMaxScrollableDistance(this.props);
    const tabWidth = this._getTabWidth(this.props);
    const tabBarWidth = tabWidth * routes.length;

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
      <View style={[ styles.tabbar, this.props.style ]}>
        <Animated.View pointerEvents='none' style={[ styles.indiator, scrollEnabled ? { width: tabBarWidth, transform: [ { translateX } ] } : null ]}>
          {this.props.renderIndicator ?
            this.props.renderIndicator({
              ...this.props,
              width: scrollEnabled ? tabWidth : layout.width / routes.length,
            }) :
            null
          }
        </Animated.View>
        <ScrollView
          horizontal
          scrollEnabled={scrollEnabled}
          bounces={false}
          scrollsToTop={false}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={[ styles.tabcontent, scrollEnabled ? null : styles.container ]}
          scrollEventThrottle={16}
          onScroll={this._handleScroll}
          onScrollBeginDrag={this._handleBeginDrag}
          onScrollEndDrag={this._handleEndDrag}
          onMomentumScrollBegin={this._handleMomentumScrollBegin}
          onMomentumScrollEnd={this._handleMomentumScrollEnd}
          ref={this._setRef}
        >
          {routes.map((route, i) => {
            const focused = index === i;
            const outputRange = inputRange.map(inputIndex => inputIndex === i ? 1 : 0.7);
            const opacity = position.interpolate({
              inputRange,
              outputRange,
            });
            const scene = {
              route,
              focused,
              index: i,
            };
            const icon = this.props.renderIcon ? this.props.renderIcon(scene) : null;
            const label = this.props.renderLabel ? this.props.renderLabel(scene) : null;
            const badge = this.props.renderBadge ? this.props.renderBadge(scene) : null;

            const tabStyle = {};

            if (icon) {
              if (label) {
                tabStyle.paddingTop = 8;
              } else {
                tabStyle.padding = 12;
              }
            }

            if (scrollEnabled) {
              tabStyle.width = tabWidth;
            }

            return (
              <TouchableItem
                borderless
                key={route.key}
                style={styles.tab}
                pressColor={this.props.pressColor}
                delayPressIn={0}
                onPress={() => { // eslint-disable-line react/jsx-no-bind
                  const { onTabPress, jumpToIndex } = this.props;
                  jumpToIndex(i);
                  if (onTabPress) {
                    onTabPress(routes[i]);
                  }
                }}
              >
                <View style={styles.container}>
                  <Animated.View style={[ styles.tabitem, { opacity }, tabStyle, this.props.tabStyle ]}>
                    {icon}
                    {label}
                  </Animated.View>
                  {badge ?
                    <View style={styles.badge}>
                      {badge}
                    </View> : null
                  }
                </View>
              </TouchableItem>
            );
          })}
        </ScrollView>
      </View>
    );
  }
}
