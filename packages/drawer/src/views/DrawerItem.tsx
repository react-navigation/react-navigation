import * as React from 'react';
import {
  Text,
  View,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';
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
   * Whether to highlight the drawer item as active.
   */
  focused: boolean;
  /**
   * Function to execute on press.
   */
  onPress?: () => void;
  /**
   * Color for the icon and label.
   */
  color: string;
  /**
   * Style object for the label element.
   */
  labelStyle?: StyleProp<TextStyle>;
  /**
   * Style object for the wrapper element.
   */
  style?: StyleProp<ViewStyle>;
};

/**
 * A component used to show an action item with an icon and a label in a navigation drawer.
 */
export default function DrawerItem({
  icon,
  label,
  focused,
  color,
  style,
  onPress,
  ...rest
}: Props) {
  const { borderRadius = 4 } = StyleSheet.flatten(style || {});

  const iconNode = icon ? icon({ size: 24, focused, color }) : null;

  return (
    <View {...rest} style={[styles.container, { borderRadius }, style]}>
      <TouchableItem
        borderless
        delayPressIn={0}
        onPress={onPress}
        style={[styles.wrapper, { borderRadius }]}
        accessibilityTraits={focused ? ['button', 'selected'] : 'button'}
        accessibilityComponentType="button"
        accessibilityRole="button"
        accessibilityStates={focused ? ['selected'] : []}
      >
        <React.Fragment>
          {iconNode}
          {typeof label === 'function' ? (
            label({ color, focused })
          ) : (
            <Text
              numberOfLines={1}
              style={[
                styles.label,
                {
                  color,
                  fontWeight: '500',
                  marginLeft: iconNode ? 32 : 0,
                  marginVertical: 5,
                },
              ]}
            >
              {label}
            </Text>
          )}
        </React.Fragment>
      </TouchableItem>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 10,
    marginVertical: 4,
  },
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  label: {
    marginRight: 32,
  },
});
