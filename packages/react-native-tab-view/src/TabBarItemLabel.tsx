import React from 'react';
import type {
  OpaqueColorValue,
  StyleProp,
  TextStyle,
  ViewStyle,
} from 'react-native';
import { Animated, StyleSheet } from 'react-native';

interface TabBarItemLabelProps {
  color:
    | string
    | OpaqueColorValue
    | Animated.Value
    | Animated.AnimatedInterpolation<string | number>;
  fontSize:
    | number
    | Animated.Value
    | Animated.AnimatedInterpolation<string | number>
    | undefined;
  fontWeight:
    | TextStyle['fontWeight']
    | Animated.Value
    | Animated.AnimatedInterpolation<string | number>
    | undefined;
  label?: string;
  style: StyleProp<ViewStyle>;
  icon: React.ReactNode;
}

export const TabBarItemLabel = React.memo(
  ({
    color,
    label,
    style,
    icon,
    fontSize,
    fontWeight,
  }: TabBarItemLabelProps) => {
    if (!label) {
      return null;
    }

    return (
      <Animated.Text
        style={[
          styles.label,
          icon ? { marginTop: 0 } : null,
          style,
          { color: color, fontSize: fontSize, fontWeight },
        ]}
      >
        {label}
      </Animated.Text>
    );
  }
);

TabBarItemLabel.displayName = 'TabBarItemLabel';

const styles = StyleSheet.create({
  label: {
    margin: 4,
    fontSize: 14,
    fontWeight: '500',
    backgroundColor: 'transparent',
  },
});
