import * as React from 'react';
import type { ColorValue, StyleProp, ViewStyle } from 'react-native';
import { Animated, StyleSheet } from 'react-native';

interface TabBarItemLabelProps {
  color: ColorValue;
  label: string | undefined;
  icon: React.ReactNode;
  style: StyleProp<ViewStyle>;
  allowFontScaling?: boolean | undefined;
}

export const TabBarItemLabel = React.memo(
  ({ color, label, style, icon, allowFontScaling }: TabBarItemLabelProps) => {
    if (!label) {
      return null;
    }

    return (
      <Animated.Text
        allowFontScaling={allowFontScaling}
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
    fontSize: 14,
    fontWeight: '500',
    backgroundColor: 'transparent',
  },
});
