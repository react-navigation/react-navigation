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
import {
  Route,
  NavigationContext,
  CommonActions,
} from '@react-navigation/native';
import { SafeAreaConsumer } from 'react-native-safe-area-context';

import BottomTabItem from './BottomTabItem';
import { BottomTabBarProps } from '../types';

type State = {
  dimensions: { height: number; width: number };
  layout: { height: number; width: number };
  keyboard: boolean;
  visible: Animated.Value;
};

type Props = BottomTabBarProps & {
  activeTintColor?: string;
  inactiveTintColor?: string;
};

const DEFAULT_TABBAR_HEIGHT = 50;
const DEFAULT_MAX_TAB_ITEM_WIDTH = 125;

export default class BottomTabBar extends React.Component<Props, State> {
  static defaultProps = {
    keyboardHidesTabBar: false,
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

  private getLabelText = ({ route }: { route: Route<string> }) => {
    const { options } = this.props.descriptors[route.key];

    return options.tabBarLabel !== undefined
      ? options.tabBarLabel
      : options.title !== undefined
      ? options.title
      : route.name;
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
      navigation,
      descriptors,
      keyboardHidesTabBar,
      activeTintColor,
      inactiveTintColor,
      activeBackgroundColor,
      inactiveBackgroundColor,
      labelStyle,
      showIcon,
      showLabel,
      allowFontScaling,
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
                const { options } = descriptors[route.key];

                const onPress = () => {
                  const event = navigation.emit({
                    type: 'tabPress',
                    target: route.key,
                  });

                  if (!focused && !event.defaultPrevented) {
                    navigation.dispatch({
                      ...CommonActions.navigate(route.name),
                      target: state.key,
                    });
                  }
                };

                const onLongPress = () => {
                  navigation.emit({
                    type: 'tabLongPress',
                    target: route.key,
                  });
                };

                const label = this.getLabelText({ route });
                const accessibilityLabel =
                  options.tabBarAccessibilityLabel !== undefined
                    ? options.tabBarAccessibilityLabel
                    : typeof label === 'string'
                    ? `${label}, tab, ${index + 1} of ${routes.length}`
                    : undefined;

                return (
                  <NavigationContext.Provider
                    key={route.key}
                    value={descriptors[route.key].navigation}
                  >
                    <BottomTabItem
                      route={route}
                      focused={focused}
                      horizontal={this.shouldUseHorizontalLabels()}
                      onPress={onPress}
                      onLongPress={onLongPress}
                      accessibilityLabel={accessibilityLabel}
                      testID={options.tabBarTestID}
                      allowFontScaling={allowFontScaling}
                      activeTintColor={activeTintColor}
                      inactiveTintColor={inactiveTintColor}
                      activeBackgroundColor={activeBackgroundColor}
                      inactiveBackgroundColor={inactiveBackgroundColor}
                      button={options.tabBarButton}
                      icon={options.tabBarIcon}
                      label={label}
                      showIcon={showIcon}
                      showLabel={showLabel}
                      labelStyle={labelStyle}
                      style={tabStyle}
                    />
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
});
