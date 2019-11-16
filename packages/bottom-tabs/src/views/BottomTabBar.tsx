import React from 'react';
import {
  View,
  Animated,
  StyleSheet,
  Keyboard,
  Platform,
  LayoutChangeEvent,
  ScaledSize,
  Dimensions,
} from 'react-native';
import { Route, NavigationContext } from '@react-navigation/core';
import { SafeAreaConsumer } from 'react-native-safe-area-context';

import TabBarIcon from './TabBarIcon';
import { BottomTabBarProps } from '../types';

type State = {
  dimensions: { height: number; width: number };
  layout: { height: number; width: number };
  keyboard: boolean;
  visible: Animated.Value;
};

type Props = BottomTabBarProps & {
  activeTintColor: string;
  inactiveTintColor: string;
};

const DEFAULT_TABBAR_HEIGHT = 50;
const DEFAULT_MAX_TAB_ITEM_WIDTH = 125;

export default class TabBarBottom extends React.Component<Props, State> {
  static defaultProps = {
    keyboardHidesTabBar: false,
    activeTintColor: '#007AFF',
    activeBackgroundColor: 'transparent',
    inactiveTintColor: '#8E8E93',
    inactiveBackgroundColor: 'transparent',
    showLabel: true,
    showIcon: true,
    allowFontScaling: true,
    adaptive: true,
  };

  state = {
    dimensions: Dimensions.get('window'),
    layout: { height: 0, width: 0 },
    keyboard: false,
    visible: new Animated.Value(1),
  };

  componentDidMount() {
    Dimensions.addEventListener('change', this.handleOrientationChange);

    if (Platform.OS === 'ios') {
      Keyboard.addListener('keyboardWillShow', this.handleKeyboardShow);
      Keyboard.addListener('keyboardWillHide', this.handleKeyboardHide);
    } else {
      Keyboard.addListener('keyboardDidShow', this.handleKeyboardShow);
      Keyboard.addListener('keyboardDidHide', this.handleKeyboardHide);
    }
  }

  componentWillUnmount() {
    Dimensions.removeEventListener('change', this.handleOrientationChange);

    if (Platform.OS === 'ios') {
      Keyboard.removeListener('keyboardWillShow', this.handleKeyboardShow);
      Keyboard.removeListener('keyboardWillHide', this.handleKeyboardHide);
    } else {
      Keyboard.removeListener('keyboardDidShow', this.handleKeyboardShow);
      Keyboard.removeListener('keyboardDidHide', this.handleKeyboardHide);
    }
  }

  private handleOrientationChange = ({ window }: { window: ScaledSize }) => {
    this.setState({ dimensions: window });
  };

  private handleKeyboardShow = () =>
    this.setState({ keyboard: true }, () =>
      Animated.timing(this.state.visible, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start()
    );

  private handleKeyboardHide = () =>
    Animated.timing(this.state.visible, {
      toValue: 1,
      duration: 250,
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) {
        this.setState({ keyboard: false });
      }
    });

  private handleLayout = (e: LayoutChangeEvent) => {
    const { layout } = this.state;
    const { height, width } = e.nativeEvent.layout;

    if (height === layout.height && width === layout.width) {
      return;
    }

    this.setState({
      layout: {
        height,
        width,
      },
    });
  };

  private renderLabel = ({
    route,
    focused,
  }: {
    route: Route<string>;
    focused: boolean;
  }) => {
    const {
      activeTintColor,
      inactiveTintColor,
      labelStyle,
      showLabel,
      showIcon,
      allowFontScaling,
    } = this.props;

    if (showLabel === false) {
      return null;
    }

    const label = this.props.getLabelText({ route });
    const horizontal = this.shouldUseHorizontalLabels();
    const color = focused ? activeTintColor : inactiveTintColor;

    if (typeof label === 'string') {
      return (
        <Animated.Text
          numberOfLines={1}
          style={[
            styles.label,
            { color },
            showIcon && horizontal ? styles.labelBeside : styles.labelBeneath,
            labelStyle,
          ]}
          allowFontScaling={allowFontScaling}
        >
          {label}
        </Animated.Text>
      );
    }

    if (typeof label === 'string') {
      return label;
    }

    return label({ focused, color });
  };

  private renderIcon = ({
    route,
    focused,
  }: {
    route: Route<string>;
    focused: boolean;
  }) => {
    const {
      activeTintColor,
      inactiveTintColor,
      renderIcon,
      showIcon,
    } = this.props;

    if (showIcon === false) {
      return null;
    }

    const horizontal = this.shouldUseHorizontalLabels();

    const activeOpacity = focused ? 1 : 0;
    const inactiveOpacity = focused ? 0 : 1;

    return (
      <TabBarIcon
        route={route}
        size={horizontal ? 17 : 24}
        activeOpacity={activeOpacity}
        inactiveOpacity={inactiveOpacity}
        activeTintColor={activeTintColor}
        inactiveTintColor={inactiveTintColor}
        renderIcon={renderIcon}
        style={horizontal ? styles.iconHorizontal : styles.iconVertical}
      />
    );
  };

  private shouldUseHorizontalLabels = () => {
    const { state, adaptive, tabStyle, labelPosition } = this.props;
    const { dimensions } = this.state;
    const { routes } = state;
    const isLandscape = dimensions.width > dimensions.height;

    if (labelPosition) {
      let position;

      if (typeof labelPosition === 'string') {
        position = labelPosition;
      } else {
        position = labelPosition({ dimensions });
      }

      if (position) {
        return position === 'beside-icon';
      }
    }

    if (!adaptive) {
      return false;
    }

    if (dimensions.width >= 768) {
      // Screen size matches a tablet
      let maxTabItemWidth = DEFAULT_MAX_TAB_ITEM_WIDTH;

      const flattenedStyle = StyleSheet.flatten(tabStyle);

      if (flattenedStyle) {
        if (typeof flattenedStyle.width === 'number') {
          maxTabItemWidth = flattenedStyle.width;
        } else if (typeof flattenedStyle.maxWidth === 'number') {
          maxTabItemWidth = flattenedStyle.maxWidth;
        }
      }

      return routes.length * maxTabItemWidth <= dimensions.width;
    } else {
      return isLandscape;
    }
  };

  render() {
    const {
      state,
      descriptors,
      keyboardHidesTabBar,
      activeBackgroundColor,
      inactiveBackgroundColor,
      onTabPress,
      onTabLongPress,
      getAccessibilityLabel,
      getAccessibilityRole,
      getAccessibilityStates,
      renderButton,
      getTestID,
      style,
      tabStyle,
    } = this.props;
    const { routes } = state;

    return (
      <SafeAreaConsumer>
        {insets => (
          <Animated.View
            style={[
              styles.tabBar,
              keyboardHidesTabBar
                ? {
                    // When the keyboard is shown, slide down the tab bar
                    transform: [
                      {
                        translateY: this.state.visible.interpolate({
                          inputRange: [0, 1],
                          outputRange: [this.state.layout.height, 0],
                        }),
                      },
                    ],
                    // Absolutely position the tab bar so that the content is below it
                    // This is needed to avoid gap at bottom when the tab bar is hidden
                    position: this.state.keyboard ? 'absolute' : null,
                  }
                : null,
              {
                height: DEFAULT_TABBAR_HEIGHT + (insets ? insets.bottom : 0),
                paddingBottom: insets ? insets.bottom : 0,
              },
              style,
            ]}
            pointerEvents={
              keyboardHidesTabBar && this.state.keyboard ? 'none' : 'auto'
            }
          >
            <View style={styles.content} onLayout={this.handleLayout}>
              {routes.map((route, index) => {
                const focused = index === state.index;
                const scene = { route, focused };
                const accessibilityLabel = getAccessibilityLabel({
                  route,
                });

                const accessibilityRole = getAccessibilityRole({
                  route,
                });

                const accessibilityStates = getAccessibilityStates(scene);

                const testID = getTestID({ route });

                const backgroundColor = focused
                  ? activeBackgroundColor
                  : inactiveBackgroundColor;

                return (
                  <NavigationContext.Provider
                    key={route.key}
                    value={descriptors[route.key].navigation}
                  >
                    {renderButton({
                      route,
                      onPress: () => onTabPress({ route }),
                      onLongPress: () => onTabLongPress({ route }),
                      testID,
                      accessibilityLabel,
                      accessibilityRole,
                      accessibilityStates,
                      style: [
                        styles.tab,
                        { backgroundColor },
                        this.shouldUseHorizontalLabels()
                          ? styles.tabLandscape
                          : styles.tabPortrait,
                        tabStyle,
                      ],
                      children: (
                        <React.Fragment>
                          {this.renderIcon(scene)}
                          {this.renderLabel(scene)}
                        </React.Fragment>
                      ),
                    })}
                  </NavigationContext.Provider>
                );
              })}
            </View>
          </Animated.View>
        )}
      </SafeAreaConsumer>
    );
  }
}

const styles = StyleSheet.create({
  tabBar: {
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#fff',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(0, 0, 0, .3)',
    elevation: 8,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
  },
  tabPortrait: {
    justifyContent: 'flex-end',
    flexDirection: 'column',
  },
  tabLandscape: {
    justifyContent: 'center',
    flexDirection: 'row',
  },
  iconVertical: {
    flex: 1,
  },
  iconHorizontal: {
    height: '100%',
  },
  label: {
    textAlign: 'center',
    backgroundColor: 'transparent',
  },
  labelBeneath: {
    fontSize: 11,
    marginBottom: 1.5,
  },
  labelBeside: {
    fontSize: 12,
    marginLeft: 20,
  },
});
