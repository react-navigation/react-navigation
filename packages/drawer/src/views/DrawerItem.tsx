import { LinkPressable } from '@react-navigation/elements';
import { Route, useTheme } from '@react-navigation/native';
import Color from 'color';
import * as React from 'react';
import {
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';

type Props = {
  /**
   * The route object which should be specified by the drawer item.
   */
  route: Route<string>;
  /**
   * The `href` to use for the anchor tag on web
   */
  href?: string;
  /**
   * The label text of the item.
   */
  label:
    | string
    | ((props: { focused: boolean; color: string }) => React.ReactNode);
  /**
   * Icon to display for the `DrawerItem`.
   */
  icon?: (props: {
    focused: boolean;
    size: number;
    color: string;
  }) => React.ReactNode;
  /**
   * Whether to highlight the drawer item as active.
   */
  focused?: boolean;
  /**
   * Function to execute on press.
   */
  onPress: () => void;
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
   * Color of the touchable effect on press.
   * Only supported on Android.
   *
   * @platform android
   */
  pressColor?: string;
  /**
   * Opacity of the touchable effect on press.
   * Only supported on iOS.
   *
   * @platform ios
   */
  pressOpacity?: number;
  /**
   * Style object for the label element.
   */
  labelStyle?: StyleProp<TextStyle>;
  /**
   * Style object for the wrapper element.
   */
  style?: StyleProp<ViewStyle>;
  /**
   * Whether label font should scale to respect Text Size accessibility settings.
   */
  allowFontScaling?: boolean;
};

/**
 * A component used to show an action item with an icon and a label in a navigation drawer.
 */
export default function DrawerItem(props: Props) {
  const { colors } = useTheme();

  const {
    route,
    icon,
    label,
    labelStyle,
    focused = false,
    allowFontScaling,
    activeTintColor = colors.primary,
    inactiveTintColor = Color(colors.text).alpha(0.68).rgb().string(),
    activeBackgroundColor = Color(activeTintColor).alpha(0.12).rgb().string(),
    inactiveBackgroundColor = 'transparent',
    style,
    onPress,
    pressColor,
    pressOpacity,
    ...rest
  } = props;

  const { borderRadius = 4 } = StyleSheet.flatten(style || {});
  const color = focused ? activeTintColor : inactiveTintColor;
  const backgroundColor = focused
    ? activeBackgroundColor
    : inactiveBackgroundColor;

  const iconNode = icon ? icon({ size: 24, focused, color }) : null;

  return (
    <View
      collapsable={false}
      {...rest}
      style={[styles.container, { borderRadius, backgroundColor }, style]}
    >
      <LinkPressable
        onPress={onPress}
        style={[styles.wrapper, { borderRadius }]}
        accessibilityRole="button"
        accessibilityState={{ selected: focused }}
        pressColor={pressColor}
        pressOpacity={pressOpacity}
        route={route}
      >
        <React.Fragment>
          {iconNode}
          <View
            style={[
              styles.label,
              { marginLeft: iconNode ? 32 : 0, marginVertical: 5 },
            ]}
          >
            {typeof label === 'string' ? (
              <Text
                numberOfLines={1}
                allowFontScaling={allowFontScaling}
                style={[
                  {
                    color,
                    fontWeight: '500',
                  },
                  labelStyle,
                ]}
              >
                {label}
              </Text>
            ) : (
              label({ color, focused })
            )}
          </View>
        </React.Fragment>
      </LinkPressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 10,
    marginVertical: 4,
    overflow: 'hidden',
  },
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  label: {
    marginRight: 32,
    flex: 1,
  },
});
