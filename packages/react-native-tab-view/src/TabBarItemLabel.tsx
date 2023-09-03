import React from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { Animated, StyleSheet } from 'react-native';

interface TabBarItemLabelProps {
  color: string;
  label?: string;
  labelStyle: StyleProp<ViewStyle>;
  icon: React.ReactNode;
}

export const TabBarItemLabel = React.memo(
  ({ color, label, labelStyle, icon }: TabBarItemLabelProps) => {
    if (!label) {
      return null;
    }

    return (
      <Animated.Text
        style={[
          styles.label,
          icon ? { marginTop: 0 } : null,
          labelStyle,
          { color: color },
        ]}
      >
        {label}
      </Animated.Text>
    );
  }
);

const styles = StyleSheet.create({
  label: {
    margin: 4,
    backgroundColor: 'transparent',
    textTransform: 'uppercase',
  },
});
