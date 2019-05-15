import * as React from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';
import Animated from 'react-native-reanimated';
import TabBarItem from './TabBarItem';
import TabBarIndicator, { Props as IndicatorProps } from './TabBarIndicator';

import memoize from './memoize';
import { Route, Scene, SceneRendererProps, NavigationState } from './types';

export type Props<T extends Route> = SceneRendererProps & {
  navigationState: NavigationState<T>;
  scrollEnabled?: boolean;
  bounces?: boolean;
  activeColor?: string;
  inactiveColor?: string;
  pressColor?: string;
  pressOpacity?: number;
  getLabelText: (scene: Scene<T>) => string | undefined;
  getAccessible: (scene: Scene<T>) => boolean | undefined;
  getAccessibilityLabel: (scene: Scene<T>) => string | undefined;
  getTestID: (scene: Scene<T>) => string | undefined;
  renderLabel?: (
    scene: Scene<T> & {
      focused: boolean;
      color: string;
    }
  ) => React.ReactNode;
  renderIcon?: (
    scene: Scene<T> & {
      focused: boolean;
      color: string;
    }
  ) => React.ReactNode;
  renderBadge?: (scene: Scene<T>) => React.ReactNode;
  renderIndicator: (props: IndicatorProps<T>) => React.ReactNode;
  onTabPress?: (scene: Scene<T>) => void;
  onTabLongPress?: (scene: Scene<T>) => void;
  tabStyle?: StyleProp<ViewStyle>;
  indicatorStyle?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
  style?: StyleProp<ViewStyle>;
};

type State = {
  initialOffset: { x: number; y: number } | undefined;
};

export default class TabBar<T extends Route> extends React.Component<
  Props<T>,
  State
> {
  static defaultProps = {
    getLabelText: ({ route }: Scene<Route>) =>
      typeof route.title === 'string' ? route.title.toUpperCase() : route.title,
    getAccessible: ({ route }: Scene<Route>) =>
      typeof route.accessible !== 'undefined' ? route.accessible : true,
    getAccessibilityLabel: ({ route }: Scene<Route>) =>
      typeof route.accessibilityLabel === 'string'
        ? route.accessibilityLabel
        : typeof route.title === 'string'
        ? route.title
        : undefined,
    getTestID: ({ route }: Scene<Route>) => route.testID,
    renderIndicator: (props: IndicatorProps<Route>) => (
      <TabBarIndicator {...props} />
    ),
  };

  constructor(props: Props<T>) {
    super(props);

    const initialOffset =
      this.props.scrollEnabled && this.props.layout.width
        ? {
            x: this.getScrollAmount(
              this.props,
              this.props.navigationState.index
            ),
            y: 0,
          }
        : undefined;

    this.state = {
      initialOffset,
    };
  }

  componentDidUpdate(prevProps: Props<T>) {
    if (
      prevProps.navigationState.routes.length !==
        this.props.navigationState.routes.length ||
      prevProps.layout.width !== this.props.layout.width
    ) {
      this.resetScroll(this.props.navigationState.index, false);
    } else if (
      prevProps.navigationState.index !== this.props.navigationState.index
    ) {
      this.resetScroll(this.props.navigationState.index);
    }
  }

  private scrollAmount = new Animated.Value(0);

  private scrollView: ScrollView | undefined;
  private isMomentumScroll: boolean = false;
  private scrollResetCallback: number | undefined;

  private getTabWidth = (props: Props<T>) => {
    const { layout, navigationState, tabStyle } = props;
    const flattened: ViewStyle = StyleSheet.flatten(tabStyle);

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

  private normalizeScrollValue = (props: Props<T>, value: number) => {
    const { layout, navigationState } = props;
    const tabWidth = this.getTabWidth(props);
    const tabBarWidth = Math.max(
      tabWidth * navigationState.routes.length,
      layout.width
    );
    const maxDistance = tabBarWidth - layout.width;

    return Math.max(Math.min(value, maxDistance), 0);
  };

  private getScrollAmount = (props: Props<T>, i: number) => {
    const { layout } = props;
    const tabWidth = this.getTabWidth(props);
    const centerDistance = tabWidth * (i + 1 / 2);
    const scrollAmount = centerDistance - layout.width / 2;

    return this.normalizeScrollValue(props, scrollAmount);
  };

  private resetScroll = (value: number, animated = true) => {
    if (this.props.scrollEnabled) {
      this.scrollResetCallback &&
        cancelAnimationFrame(this.scrollResetCallback);

      this.scrollResetCallback = requestAnimationFrame(() => {
        this.scrollView &&
          this.scrollView.scrollTo({
            x: this.getScrollAmount(this.props, value),
            animated,
          });
      });
    }
  };

  private handleBeginDrag = () => {
    // onScrollBeginDrag fires when user touches the ScrollView
    this.isMomentumScroll = false;
  };

  private handleEndDrag = () => {
    // onScrollEndDrag fires when user lifts his finger
    // onMomentumScrollBegin fires after touch end
    // run the logic in next frame so we get onMomentumScrollBegin first
    requestAnimationFrame(() => {
      if (this.isMomentumScroll) {
        return;
      }
    });
  };

  private handleMomentumScrollBegin = () => {
    // onMomentumScrollBegin fires on flick, as well as programmatic scroll
    this.isMomentumScroll = true;
  };

  private handleMomentumScrollEnd = () => {
    // onMomentumScrollEnd fires when the scroll finishes
    this.isMomentumScroll = false;
  };

  private getTranslateX = memoize((scrollAmount: Animated.Node<number>) =>
    Animated.multiply(scrollAmount, -1)
  );

  render() {
    const {
      position,
      layout,
      navigationState,
      jumpTo,
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
    const tabWidth = this.getTabWidth(this.props);
    const tabBarWidth = tabWidth * routes.length;
    const translateX = this.getTranslateX(this.scrollAmount);

    return (
      <Animated.View style={[styles.tabBar, style]}>
        <Animated.View
          pointerEvents="none"
          style={[
            styles.indicatorContainer,
            scrollEnabled
              ? { width: tabBarWidth, transform: [{ translateX }] as any }
              : null,
          ]}
        >
          {this.props.renderIndicator({
            position,
            layout,
            navigationState,
            jumpTo,
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
                    contentOffset: { x: this.scrollAmount },
                  },
                },
              ],
              { useNativeDriver: true }
            )}
            onScrollBeginDrag={this.handleBeginDrag}
            onScrollEndDrag={this.handleEndDrag}
            onMomentumScrollBegin={this.handleMomentumScrollBegin}
            onMomentumScrollEnd={this.handleMomentumScrollEnd}
            contentOffset={this.state.initialOffset}
            ref={el => {
              // @ts-ignore
              this.scrollView = el && el.getNode();
            }}
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
      width: 0,
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
