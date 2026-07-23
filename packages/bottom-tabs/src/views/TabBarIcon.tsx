import { Badge, type Icon, PlatformIcon } from '@react-navigation/elements';
import { MissingIcon } from '@react-navigation/elements/internal';
import { type Route } from '@react-navigation/native';
import * as React from 'react';
import {
  type ColorValue,
  type StyleProp,
  StyleSheet,
  type TextStyle,
  View,
  type ViewStyle,
} from 'react-native';

export type TabBarIconProps = {
  route: Route<string>;
  variant: 'uikit' | 'material';
  size: 'compact' | 'regular';
  /**
   * Explicit icon size (in dp) overriding the default for the variant/size.
   */
  iconSize?: number | undefined;
  badge?: string | number | undefined;
  badgeStyle?: StyleProp<TextStyle> | undefined;
  activeOpacity: number;
  inactiveOpacity: number;
  activeTintColor: ColorValue;
  inactiveTintColor: ColorValue;
  icon:
    | Icon
    | ((props: {
        focused: boolean;
        color: ColorValue;
        size: number;
      }) => Icon | React.ReactNode);
  allowFontScaling?: boolean | undefined;
  style: StyleProp<ViewStyle>;
};

/**
 * Icon sizes taken from Apple HIG
 * https://developer.apple.com/design/human-interface-guidelines/tab-bars
 */
const ICON_SIZE_WIDE = 31;
const ICON_SIZE_WIDE_COMPACT = 23;
const ICON_SIZE_TALL = 28;
const ICON_SIZE_TALL_COMPACT = 20;
const ICON_SIZE_SQUARE = 23;
const ICON_SIZE_SQUARE_COMPACT = 17;
const ICON_SIZE_MATERIAL = 24;

export function TabBarIcon({
  route: _,
  variant,
  size,
  iconSize: iconSizeOverride,
  badge,
  badgeStyle,
  activeOpacity,
  inactiveOpacity,
  activeTintColor,
  inactiveTintColor,
  icon,
  allowFontScaling,
  style,
}: TabBarIconProps) {
  const iconSize =
    iconSizeOverride ??
    (variant === 'material'
      ? ICON_SIZE_MATERIAL
      : size === 'compact'
        ? ICON_SIZE_SQUARE_COMPACT
        : ICON_SIZE_SQUARE);

  // Grow only the container's width to fit a wider image (e.g. a logo); height
  // stays the default so icons stay vertically aligned across tabs.
  const imageAspectRatio =
    typeof icon === 'object' && icon != null && 'type' in icon
      ? icon.type === 'image'
        ? icon.aspectRatio
        : undefined
      : undefined;
  const boxWidth =
    imageAspectRatio != null
      ? iconSize * imageAspectRatio
      : iconSizeOverride;

  // We render the icon twice at the same position on top of each other:
  // active and inactive one, so we can fade between them.
  return (
    <View
      style={[
        variant === 'material'
          ? styles.wrapperMaterial
          : size === 'compact'
            ? styles.wrapperUikitCompact
            : styles.wrapperUikit,
        boxWidth != null && { width: boxWidth },
        style,
      ]}
    >
      <View
        style={[
          styles.icon,
          {
            opacity: activeOpacity,
            // Workaround for react-native >= 0.54 layout bug
            minWidth: iconSize,
          },
        ]}
      >
        {renderIcon({
          focused: true,
          size: iconSize,
          color: activeTintColor,
          icon,
        })}
      </View>
      <View style={[styles.icon, { opacity: inactiveOpacity }]}>
        {renderIcon({
          focused: false,
          size: iconSize,
          color: inactiveTintColor,
          icon,
        })}
      </View>
      <Badge
        visible={badge != null}
        size={iconSize * 0.75}
        allowFontScaling={allowFontScaling}
        style={[styles.badge, badgeStyle]}
      >
        {badge}
      </Badge>
    </View>
  );
}

function renderIcon({
  focused,
  size,
  color,
  icon,
}: {
  focused: boolean;
  size: number;
  color: ColorValue;
  icon: TabBarIconProps['icon'];
}) {
  const iconValue =
    typeof icon === 'function' ? icon({ focused, size, color }) : icon;

  if (React.isValidElement(iconValue)) {
    return iconValue;
  }

  if (
    typeof iconValue === 'object' &&
    iconValue != null &&
    'type' in iconValue
  ) {
    return <PlatformIcon icon={iconValue} size={size} color={color} />;
  }

  return <MissingIcon color={color} size={size} />;
}

const styles = StyleSheet.create({
  icon: {
    // We render the icon twice at the same position on top of each other:
    // active and inactive one, so we can fade between them:
    // Cover the whole iconContainer:
    position: 'absolute',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    width: '100%',
  },
  wrapperUikit: {
    width: ICON_SIZE_WIDE,
    height: ICON_SIZE_TALL,
  },
  wrapperUikitCompact: {
    width: ICON_SIZE_WIDE_COMPACT,
    height: ICON_SIZE_TALL_COMPACT,
  },
  wrapperMaterial: {
    width: ICON_SIZE_MATERIAL,
    height: ICON_SIZE_MATERIAL,
  },
  badge: {
    position: 'absolute',
    end: -3,
    top: -3,
  },
});
