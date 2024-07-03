import { getLabel, Label, PlatformPressable } from '@react-navigation/elements';
import { type Route, useTheme } from '@react-navigation/native';
import Color from 'color';
import React from 'react';
import {
  type GestureResponderEvent,
  Platform,
  type StyleProp,
  StyleSheet,
  type TextStyle,
  View,
  type ViewStyle,
} from 'react-native';

import type {
  BottomTabBarButtonProps,
  BottomTabDescriptor,
  LabelPosition,
} from '../types';
import { TabBarIcon } from './TabBarIcon';

type Props = {
  /**
   * The route object which should be specified by the tab.
   */
  route: Route<string>;
  /**
   * The `href` to use for the anchor tag on web
   */
  href?: string;
  /**
   * Whether the tab is focused.
   */
  focused: boolean;
  /**
   * The descriptor object for the route.
   */
  descriptor: BottomTabDescriptor;
  /**
   * The label text of the tab.
   */
  label:
    | string
    | ((props: {
        focused: boolean;
        color: string;
        position: LabelPosition;
        children: string;
      }) => React.ReactNode);
  /**
   * Icon to display for the tab.
   */
  icon: (props: {
    focused: boolean;
    size: number;
    color: string;
  }) => React.ReactNode;
  /**
   * Text to show in a badge on the tab icon.
   */
  badge?: number | string;
  /**
   * Custom style for the badge.
   */
  badgeStyle?: StyleProp<TextStyle>;
  /**
   * The button for the tab. Uses a `Pressable` by default.
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
   * Function to execute on press in React Native.
   * On the web, this will use onClick.
   */
  onPress: (
    e: React.MouseEvent<HTMLElement, MouseEvent> | GestureResponderEvent
  ) => void;
  /**
   * Function to execute on long press.
   */
  onLongPress: (e: GestureResponderEvent) => void;
  /**
   * Whether the label should be aligned with the icon horizontally.
   */
  horizontal: boolean;
  /**
   * Whether to render the icon and label in compact mode.
   */
  compact: boolean;
  /**
   * Variant of navigation bar styling
   * - `uikit`: iOS UIKit style
   * - `material`: Material Design style
   */
  variant: 'uikit' | 'material';
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
   * Whether to allow scaling the font for the label for accessibility purposes.
   */
  allowFontScaling?: boolean;
  /**
   * Style object for the label element.
   */
  labelStyle?: StyleProp<TextStyle>;
  /**
   * Style object for the icon element.
   */
  iconStyle?: StyleProp<ViewStyle>;
  /**
   * Style object for the wrapper element.
   */
  style?: StyleProp<ViewStyle>;
};

export function BottomTabItem({
  route,
  href,
  focused,
  descriptor,
  label,
  icon,
  badge,
  badgeStyle,
  button = (props: BottomTabBarButtonProps) => <PlatformPressable {...props} />,
  accessibilityLabel,
  testID,
  onPress,
  onLongPress,
  horizontal,
  compact,
  variant,
  activeTintColor: customActiveTintColor,
  inactiveTintColor: customInactiveTintColor,
  activeBackgroundColor = 'transparent',
  inactiveBackgroundColor = 'transparent',
  showLabel = true,
  allowFontScaling,
  labelStyle,
  iconStyle,
  style,
}: Props) {
  const { colors, fonts } = useTheme();

  const activeTintColor =
    customActiveTintColor === undefined
      ? colors.primary
      : customActiveTintColor;

  const inactiveTintColor =
    customInactiveTintColor === undefined
      ? Color(colors.text).mix(Color(colors.card), 0.5).hex()
      : customInactiveTintColor;

  const renderLabel = ({ focused }: { focused: boolean }) => {
    if (showLabel === false) {
      return null;
    }

    const color = focused ? activeTintColor : inactiveTintColor;

    if (typeof label !== 'string') {
      const { options } = descriptor;
      const children = getLabel(
        {
          label:
            typeof options.tabBarLabel === 'string'
              ? options.tabBarLabel
              : undefined,
          title: options.title,
        },
        route.name
      );

      return label({
        focused,
        color,
        position: horizontal ? 'beside-icon' : 'below-icon',
        children,
      });
    }

    return (
      <Label
        style={[
          horizontal
            ? [
                styles.labelBeside,
                { marginStart: icon !== undefined ? 16 : 0 },
                variant === 'material'
                  ? styles.labelBesideMaterial
                  : compact
                    ? styles.labelBesideUikitCompact
                    : styles.labelBesideUikit,
              ]
            : styles.labelBeneath,
          compact ? fonts.regular : fonts.medium,
          labelStyle,
        ]}
        allowFontScaling={allowFontScaling}
        tintColor={color}
      >
        {label}
      </Label>
    );
  };

  const renderIcon = ({ focused }: { focused: boolean }) => {
    if (icon === undefined) {
      return null;
    }

    const activeOpacity = focused ? 1 : 0;
    const inactiveOpacity = focused ? 0 : 1;

    return (
      <TabBarIcon
        route={route}
        variant={variant}
        compact={compact}
        badge={badge}
        badgeStyle={badgeStyle}
        activeOpacity={activeOpacity}
        inactiveOpacity={inactiveOpacity}
        activeTintColor={activeTintColor}
        inactiveTintColor={inactiveTintColor}
        renderIcon={icon}
        style={iconStyle}
      />
    );
  };

  const scene = { route, focused };

  const backgroundColor = focused
    ? activeBackgroundColor
    : inactiveBackgroundColor;

  const { flex } = StyleSheet.flatten(style || {});
  const borderRadius = variant === 'material' ? (horizontal ? 56 : 16) : 0;

  return (
    <View
      style={[
        // Clip ripple effect on Android
        {
          borderRadius,
          overflow: variant === 'material' ? 'hidden' : 'visible',
        },
        style,
      ]}
    >
      {button({
        href,
        onPress,
        onLongPress,
        testID,
        accessibilityLabel,
        // FIXME: accessibilityRole: 'tab' doesn't seem to work as expected on iOS
        accessibilityRole: Platform.select({ ios: 'button', default: 'tab' }),
        accessibilityState: { selected: focused },
        // @ts-expect-error: keep for compatibility with older React Native versions
        accessibilityStates: focused ? ['selected'] : [],
        android_ripple: { borderless: true },
        hoverEffect:
          variant === 'material' ? { color: colors.text } : undefined,
        pressOpacity: 1,
        style: [
          styles.tab,
          { flex, backgroundColor, borderRadius },
          horizontal
            ? variant === 'material'
              ? styles.tabHorizontalMaterial
              : styles.tabHorizontalUiKit
            : variant === 'material'
              ? styles.tabVerticalMaterial
              : styles.tabVerticalUiKit,
        ],
        children: (
          <React.Fragment>
            {renderIcon(scene)}
            {renderLabel(scene)}
          </React.Fragment>
        ),
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  tab: {
    alignItems: 'center',
    // Roundness for iPad hover effect
    borderRadius: 10,
  },
  tabVerticalUiKit: {
    justifyContent: 'flex-start',
    flexDirection: 'column',
    padding: 5,
  },
  tabVerticalMaterial: {
    padding: 10,
  },
  tabHorizontalUiKit: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    padding: 5,
  },
  tabHorizontalMaterial: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
    paddingVertical: 15,
    paddingStart: 16,
    paddingEnd: 24,
  },
  labelBeneath: {
    fontSize: 10,
  },
  labelBeside: {
    marginEnd: 12,
    lineHeight: 24,
  },
  labelBesideMaterial: {
    marginStart: 12,
  },
  labelBesideUikit: {
    fontSize: 13,
    marginStart: 5,
  },
  labelBesideUikitCompact: {
    fontSize: 12,
    marginStart: 5,
  },
});
