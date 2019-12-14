import React from 'react';
import {
  View,
  TouchableWithoutFeedback,
  Animated,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { Route, useTheme } from '@react-navigation/native';
import Color from 'color';

import TabBarIcon from './TabBarIcon';
import { BottomTabBarButtonProps } from '../types';

type Props = {
  /**
   * Whether the tab is focused.
   */
  focused: boolean;
  /**
   * The route object which should be specified by the tab.
   */
  route: Route<string>;
  /**
   * The label text of the tab.
   */
  label:
    | string
    | ((props: { focused: boolean; color: string }) => React.ReactNode);
  /**
   * Icon to display for the tab.
   */
  icon?: (props: {
    focused: boolean;
    size: number;
    color: string;
  }) => React.ReactNode;
  /**
   * The button for the tab. Uses a `TouchableWithoutFeedback` by default.
   */
  button?: (props: BottomTabBarButtonProps) => React.ReactNode;
  /**
   * The accessibility label for the tab.
   */
  accessibilityLabel?: string;
  /**
   * An unique ID for testing for the tab.
   */
  testID?: string;
  /**
   * Function to execute on press.
   */
  onPress: () => void;
  /**
   * Function to execute on long press.
   */
  onLongPress: () => void;
  /**
   * Whether the label should be aligned with the icon horizontally.
   */
  horizontal: boolean;
  /**
   * Color for the icon and label when the item is active.
   */
  activeTintColor?: string;
  /**
   * Color for the icon and label when the item is inactive.
   */
  inactiveTintColor?: string;
  /**
   * Background color for item when its active.
   */
  activeBackgroundColor?: string;
  /**
   * Background color for item when its inactive.
   */
  inactiveBackgroundColor?: string;
  /**
   * Whether to show the label text for the tab.
   */
  showLabel?: boolean;
  /**
   * Whether to show the icon for the tab.
   */
  showIcon?: boolean;
  /**
   * Whether to allow scaling the font for the label for accessibility purposes.
   */
  allowFontScaling?: boolean;
  /**
   * Style object for the label element.
   */
  labelStyle?: StyleProp<TextStyle>;
  /**
   * Style object for the wrapper element.
   */
  style?: StyleProp<ViewStyle>;
};

export default function BottomTabBarItem({
  focused,
  route,
  label,
  icon,
  button = ({ children, style, ...rest }: BottomTabBarButtonProps) => (
    <TouchableWithoutFeedback {...rest}>
      <View style={style}>{children}</View>
    </TouchableWithoutFeedback>
  ),
  accessibilityLabel,
  testID,
  onPress,
  onLongPress,
  horizontal,
  activeTintColor: customActiveTintColor,
  inactiveTintColor: customInactiveTintColor,
  activeBackgroundColor = 'transparent',
  inactiveBackgroundColor = 'transparent',
  showLabel = true,
  showIcon = true,
  allowFontScaling,
  labelStyle,
  style,
}: Props) {
  const { colors } = useTheme();

  const activeTintColor =
    customActiveTintColor === undefined
      ? colors.primary
      : customActiveTintColor;

  const inactiveTintColor =
    customInactiveTintColor === undefined
      ? Color(colors.text)
          .mix(Color(colors.card), 0.5)
          .hex()
      : customInactiveTintColor;

  const renderLabel = ({ focused }: { focused: boolean }) => {
    if (showLabel === false) {
      return null;
    }

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

  const renderIcon = ({ focused }: { focused: boolean }) => {
    if (showIcon === false || icon === undefined) {
      return null;
    }

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
        renderIcon={icon}
        style={horizontal ? styles.iconHorizontal : styles.iconVertical}
      />
    );
  };

  const scene = { route, focused };

  const backgroundColor = focused
    ? activeBackgroundColor
    : inactiveBackgroundColor;

  return button({
    onPress,
    onLongPress,
    testID,
    accessibilityLabel,
    accessibilityRole: 'button',
    accessibilityStates: focused ? ['selected'] : [],
    style: [
      styles.tab,
      { backgroundColor },
      horizontal ? styles.tabLandscape : styles.tabPortrait,
      style,
    ],
    children: (
      <React.Fragment>
        {renderIcon(scene)}
        {renderLabel(scene)}
      </React.Fragment>
    ),
  }) as React.ReactElement;
}

const styles = StyleSheet.create({
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
