import * as React from 'react';
import {
  Text,
  View,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TextStyle,
  Platform,
  TouchableWithoutFeedbackProps,
} from 'react-native';
import { Link, useTheme } from '@react-navigation/native';
import Color from 'color';
import TouchableItem from './TouchableItem';

type Props = {
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
   * URL to use for the link to the tab.
   */
  href?: string;
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
   * Style object for the label element.
   */
  labelStyle?: StyleProp<TextStyle>;
  /**
   * Style object for the wrapper element.
   */
  style?: StyleProp<ViewStyle>;
};

const Touchable = ({
  children,
  style,
  onPress,
  href,
  delayPressIn,
  ...rest
}: TouchableWithoutFeedbackProps & {
  href?: string;
  children: React.ReactNode;
  onPress?: () => void;
}) => {
  if (Platform.OS === 'web' && href) {
    // React Native Web doesn't forward `onClick` if we use `TouchableWithoutFeedback`.
    // We need to use `onClick` to be able to prevent default browser handling of links.
    return (
      <Link
        {...rest}
        // @ts-ignore
        accessibilityRole="link"
        onLink={onPress}
        to={href}
        style={[styles.button, style]}
      >
        {children}
      </Link>
    );
  } else {
    return (
      <TouchableItem {...rest} delayPressIn={delayPressIn} onPress={onPress}>
        <View style={style}>{children}</View>
      </TouchableItem>
    );
  }
};

/**
 * A component used to show an action item with an icon and a label in a navigation drawer.
 */
export default function DrawerItem(props: Props) {
  const { colors } = useTheme();

  const {
    icon,
    label,
    labelStyle,
    href,
    focused = false,
    activeTintColor = colors.primary,
    inactiveTintColor = Color(colors.text).alpha(0.68).rgb().string(),
    activeBackgroundColor = Color(activeTintColor).alpha(0.12).rgb().string(),
    inactiveBackgroundColor = 'transparent',
    style,
    onPress,
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
      <Touchable
        delayPressIn={0}
        onPress={onPress}
        style={[styles.wrapper, { borderRadius }]}
        accessibilityTraits={focused ? ['button', 'selected'] : 'button'}
        accessibilityComponentType="button"
        accessibilityRole="button"
        accessibilityStates={focused ? ['selected'] : []}
        href={href}
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
      </Touchable>
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
  },
  button: {
    display: 'flex',
  },
});
