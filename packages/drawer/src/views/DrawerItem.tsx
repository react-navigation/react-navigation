import { PlatformPressable, Text } from '@react-navigation/elements';
import { Color } from '@react-navigation/elements/internal';
import { type Route, useTheme } from '@react-navigation/native';
import * as React from 'react';
import {
  type ColorValue,
  Platform,
  type StyleProp,
  StyleSheet,
  type TextStyle,
  View,
  type ViewStyle,
} from 'react-native';

type Props = {
  /**
   * The route object which should be specified by the drawer item.
   */
  route?: Route<string> | undefined;
  /**
   * The `href` to use for the anchor tag on web
   */
  href?: string | undefined;
  /**
   * The label text of the item.
   */
  label:
    | string
    | ((props: { focused: boolean; color: ColorValue }) => React.ReactNode);
  /**
   * Icon to display for the `DrawerItem`.
   */
  icon?:
    | ((props: {
        focused: boolean;
        size: number;
        color: ColorValue;
      }) => React.ReactNode)
    | undefined;
  /**
   * Whether to highlight the drawer item as active.
   */
  focused?: boolean | undefined;
  /**
   * Function to execute on press.
   */
  onPress: () => void;
  /**
   * Color for the icon and label when the item is active.
   */
  activeTintColor?: ColorValue | undefined;
  /**
   * Color for the icon and label when the item is inactive.
   */
  inactiveTintColor?: ColorValue | undefined;
  /**
   * Background color for item when its active.
   */
  activeBackgroundColor?: ColorValue | undefined;
  /**
   * Background color for item when its inactive.
   */
  inactiveBackgroundColor?: ColorValue | undefined;
  /**
   * Color of the touchable effect on press.
   * Only supported on Android.
   *
   * @platform android
   */
  pressColor?: ColorValue | undefined;
  /**
   * Opacity of the touchable effect on press.
   * Only supported on iOS.
   *
   * @platform ios
   */
  pressOpacity?: number | undefined;
  /**
   * Style object for the label element.
   */
  labelStyle?: StyleProp<TextStyle> | undefined;
  /**
   * Style object for the wrapper element.
   */
  style?: StyleProp<ViewStyle> | undefined;
  /**
   * Whether label font should scale to respect Text Size accessibility settings.
   */
  allowFontScaling?: boolean | undefined;

  /**
   * Accessibility label for drawer item.
   */
  accessibilityLabel?: string | undefined;
  /**
   * ID to locate this drawer item in tests.
   */
  testID?: string | undefined;
};

/**
 * A component used to show an action item with an icon and a label in a navigation drawer.
 */
export function DrawerItem(props: Props) {
  const { colors, fonts } = useTheme();

  const {
    href,
    icon,
    label,
    labelStyle,
    focused = false,
    allowFontScaling,
    activeTintColor = colors.primary,
    inactiveTintColor,
    activeBackgroundColor,
    inactiveBackgroundColor = 'transparent',
    style,
    onPress,
    pressColor,
    pressOpacity = 1,
    testID,
    accessibilityLabel,
    ...rest
  } = props;

  const { borderRadius = 56 } = StyleSheet.flatten(style || {});
  const color: ColorValue = focused
    ? activeTintColor
    : (inactiveTintColor ??
      Color(colors.text)?.alpha(0.68).string() ??
      'rgba(0, 0, 0, 0.68)');
  const backgroundColor: ColorValue = focused
    ? (activeBackgroundColor ??
      Color(activeTintColor)?.alpha(0.12).string() ??
      'rgba(0, 0, 0, 0.06)')
    : inactiveBackgroundColor;

  const iconNode = icon ? icon({ size: 24, focused, color }) : null;

  return (
    <View
      collapsable={false}
      {...rest}
      style={[styles.container, { borderRadius, backgroundColor }, style]}
    >
      <PlatformPressable
        testID={testID}
        onPress={onPress}
        role="button"
        aria-label={accessibilityLabel}
        aria-selected={focused}
        pressColor={pressColor}
        pressOpacity={pressOpacity}
        hoverEffect={typeof color === 'string' ? { color } : undefined}
        href={href}
        style={{ borderRadius }}
      >
        <View style={[styles.wrapper, { borderRadius }]}>
          {iconNode}
          <View style={[styles.label, { marginStart: iconNode ? 12 : 0 }]}>
            {typeof label === 'string' ? (
              <Text
                numberOfLines={1}
                allowFontScaling={allowFontScaling}
                style={[styles.labelText, { color }, fonts.medium, labelStyle]}
              >
                {label}
              </Text>
            ) : (
              label({ color, focused })
            )}
          </View>
        </View>
      </PlatformPressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderCurve: 'continuous',
    ...Platform.select({
      android: {
        // Hide overflow to clip ripple effect
        overflow: 'hidden',
      },
      default: {
        // Don't hide overflow on web
        // Otherwise the outline gets clipped
      },
    }),
  },
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 11,
    paddingStart: 16,
    paddingEnd: 24,
    borderCurve: 'continuous',
  },
  label: {
    marginEnd: 12,
    marginVertical: 4,
    flex: 1,
  },
  labelText: {
    lineHeight: 24,
    textAlignVertical: 'center',
  },
});
