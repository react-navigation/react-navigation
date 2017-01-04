/* @flow */

import React, { PureComponent, PropTypes } from 'react';
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
  scroll: {
    overflow: 'scroll',
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
  activeOpacity?: number;
  getLabelText: (scene: Scene) => ?string;
  renderLabel?: (scene: Scene) => ?React.Element<*>;
  renderIcon?: (scene: Scene) => ?React.Element<*>;
  renderBadge?: (scene: Scene) => ?React.Element<*>;
  renderIndicator?: (props: IndicatorProps) => ?React.Element<*>;
  onTabPress?: Function;
  tabWidth?: number;
  tabStyle?: any;
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
    activeOpacity: TouchableItem.propTypes.activeOpacity,
    getLabelText: PropTypes.func,
    renderIcon: PropTypes.func,
    renderLabel: PropTypes.func,
    renderIndicator: PropTypes.func,
    onTabPress: PropTypes.func,
    tabWidth: PropTypes.number,
    tabStyle: View.propTypes.style,
    style: PropTypes.any,
  };

  static defaultProps = {
    getLabelText: ({ route }) => route.title,
  };

  state: State = {
    offset: new Animated.Value(0),
    visibility: new Animated.Value(0),
  };

  componentWillMount() {
    if (this.props.scrollEnabled === true) {
      if (this.props.layout.width || this.props.tabWidth) {
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

    if (
        (this.props.tabWidth !== nextProps.tabWidth && nextProps.tabWidth) ||
        (this.props.layout.width !== nextProps.layout.width && nextProps.layout.width)
     ) {
      this.state.visibility.setValue(1);
    }
  }

  componentDidUpdate(prevProps: Props) {
    if (this.props.scrollEnabled && (prevProps.layout !== this.props.layout || prevProps.tabWidth !== this.props.tabWidth)) {
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
  _scrollOffset: number = 0;
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
    return <Text style={styles.tablabel}>{label}</Text>;
  }

  _getTabWidth = (props: Props) => {
    const { layout, tabWidth, navigationState } = props;
    if (typeof tabWidth === 'number') {
      return tabWidth;
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
    const tabWidth = this._getTabWidth(props);
    const tabBarWidth = tabWidth * navigationState.routes.length;
    const maxDistance = tabBarWidth - layout.width;
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
    const { position, navigationState, scrollEnabled } = this.props;
    const { routes, index } = navigationState;
    const initialOffset = this._getScrollAmount(this.props, this.props.navigationState.index);
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
      <Animated.View style={[ styles.tabbar, this.props.style ]}>
        <Animated.View pointerEvents='none' style={[ styles.indiator, scrollEnabled ? { width: tabBarWidth, transform: [ { translateX } ] } : null ]}>
          {this.props.renderIndicator ?
            this.props.renderIndicator({
              ...this.props,
              width: new Animated.Value(tabWidth),
            }) :
            null
          }
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
            contentContainerStyle={[ styles.tabcontent, scrollEnabled ? null : styles.container ]}
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

              const isWidthSet = typeof this.props.tabWidth === 'number' || scrollEnabled === true;

              if (isWidthSet) {
                tabStyle.width = tabWidth;
              }

              const tabContainerStyle = {};
              const passedTabStyle = StyleSheet.flatten(this.props.tabStyle);

              if (passedTabStyle && typeof passedTabStyle.flex === 'number') {
                tabContainerStyle.flex = passedTabStyle.flex;
              } else if (!isWidthSet) {
                tabContainerStyle.flex = 1;
              }

              return (
                <TouchableItem
                  borderless
                  key={route.key}
                  accessibilityTraits='button'
                  testID={route.testID}
                  pressColor={this.props.pressColor}
                  activeOpacity={this.props.activeOpacity}
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
                    <Animated.View style={[ styles.tabitem, tabStyle, passedTabStyle, styles.container ]}>
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
