import React from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { Animated, StyleSheet } from 'react-native';

interface TabBarItemLabelProps {
  color: string;
  label?: string;
  style: StyleProp<ViewStyle>;
  icon: React.ReactNode;
}

export const TabBarItemLabel = React.memo(
  ({ color, label, style, icon }: TabBarItemLabelProps) => {
    if (!label) {
      return null;
    }

    return (
      <Animated.Text
        style={[
          styles.label,
          icon ? { marginTop: 0 } : null,
          style,
          { color: color },
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
