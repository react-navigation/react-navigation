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
import TouchableWithoutFeedbackWrapper from './TouchableWithoutFeedbackWrapper';
import { BottomTabBarProps } from '../types';

type State = {
  dimensions: { height: number; width: number };
  layout: { height: number; width: number };
  keyboard: boolean;
  visible: Animated.Value;
};

type Props = BottomTabBarProps;

const majorVersion = parseInt(Platform.Version as string, 10);
const isIos = Platform.OS === 'ios';
const isIOS11 = majorVersion >= 11 && isIos;

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
    adaptive: isIOS11,
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
    const tintColor = focused ? activeTintColor : inactiveTintColor;

    if (typeof label === 'string') {
      return (
        <Animated.Text
          numberOfLines={1}
          style={[
            styles.label,
            { color: tintColor },
            showIcon && horizontal ? styles.labelBeside : styles.labelBeneath,
            labelStyle,
          ]}
          allowFontScaling={allowFontScaling}
        >
          {label}
        </Animated.Text>
      );
    }

    if (typeof label === 'function') {
      return label({
        focused,
        tintColor,
        orientation: horizontal ? 'horizontal' : 'vertical',
      });
    }

    return label;
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
      showLabel,
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
        horizontal={horizontal}
        activeOpacity={activeOpacity}
        inactiveOpacity={inactiveOpacity}
        activeTintColor={activeTintColor}
        inactiveTintColor={inactiveTintColor}
        renderIcon={renderIcon}
        style={[
          styles.iconWithExplicitHeight,
          showLabel === false && !horizontal && styles.iconWithoutLabel,
          showLabel !== false && !horizontal && styles.iconWithLabel,
        ]}
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
        position = labelPosition({
          deviceOrientation: isLandscape ? 'horizontal' : 'vertical',
        });
      }

      if (position) {
        return position === 'beside-icon';
      }
    }

    if (!adaptive) {
      return false;
    }

    // @ts-ignore
    if (Platform.isPad) {
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
      getButtonComponent,
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
                height:
                  // @ts-ignore
                  (this.shouldUseHorizontalLabels() && !Platform.isPad
                    ? COMPACT_HEIGHT
                    : DEFAULT_HEIGHT) + (insets ? insets.bottom : 0),
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

                const ButtonComponent =
                  getButtonComponent({ route }) ||
                  TouchableWithoutFeedbackWrapper;

                return (
                  <NavigationContext.Provider
                    key={route.key}
                    value={descriptors[route.key].navigation}
                  >
                    <ButtonComponent
                      onPress={() => onTabPress({ route })}
                      onLongPress={() => onTabLongPress({ route })}
                      testID={testID}
                      accessibilityLabel={accessibilityLabel}
                      accessibilityRole={accessibilityRole}
                      accessibilityStates={accessibilityStates}
                      style={[
                        styles.tab,
                        { backgroundColor },
                        this.shouldUseHorizontalLabels()
                          ? styles.tabLandscape
                          : styles.tabPortrait,
                        tabStyle,
                      ]}
                    >
                      {this.renderIcon(scene)}
                      {this.renderLabel(scene)}
                    </ButtonComponent>
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

const DEFAULT_HEIGHT = 49;
const COMPACT_HEIGHT = 29;

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
    alignItems: isIos ? 'center' : 'stretch',
  },
  tabPortrait: {
    justifyContent: 'flex-end',
    flexDirection: 'column',
  },
  tabLandscape: {
    justifyContent: 'center',
    flexDirection: 'row',
  },
  iconWithoutLabel: {
    flex: 1,
  },
  iconWithLabel: {
    flex: 1,
  },
  iconWithExplicitHeight: {
    // @ts-ignore
    height: Platform.isPad ? DEFAULT_HEIGHT : COMPACT_HEIGHT,
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
