import React from 'react';
import { Platform, StyleSheet } from 'react-native';

import { PlatformPressable } from '../PlatformPressable';
import type { HeaderButtonProps } from '../types';

export const HeaderButton = React.forwardRef<
  React.ComponentRef<typeof PlatformPressable>,
  HeaderButtonProps
>(
  (
    {
      disabled,
      onPress,
      pressColor,
      pressOpacity,
      accessibilityLabel,
      testID,
      style,
      href,
      children,
    },
    ref
  ) => {
    return (
      <PlatformPressable
        ref={ref}
        disabled={disabled}
        href={href}
        accessibilityLabel={accessibilityLabel}
        testID={testID}
        onPress={onPress}
        pressColor={pressColor}
        pressOpacity={pressOpacity}
        android_ripple={androidRipple}
        style={[styles.container, disabled && styles.disabled, style]}
        hitSlop={Platform.select({
          ios: undefined,
          default: { top: 16, right: 16, bottom: 16, left: 16 },
        })}
      >
        {children}
      </PlatformPressable>
    );
  }
);

HeaderButton.displayName = 'HeaderButton';

const androidRipple = {
  borderless: true,
  foreground: Platform.OS === 'android' && Platform.Version >= 23,
  radius: 20,
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    // Roundness for iPad hover effect
    borderRadius: 10,
  },
  disabled: {
    opacity: 0.5,
  },
});
