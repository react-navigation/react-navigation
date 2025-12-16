import { Pressable, StyleSheet, View } from 'react-native';

import type { OverlayProps } from '../types';

export function Overlay({
  open,
  onPress,
  style,
  accessibilityLabel = 'Close drawer',
  ...rest
}: OverlayProps) {
  return (
    <View
      {...rest}
      style={[
        StyleSheet.absoluteFill,
        styles.overlay,
        { opacity: open ? 1 : 0, pointerEvents: open ? 'auto' : 'none' },
        style,
      ]}
      aria-hidden={!open}
    >
      <Pressable
        onPress={onPress}
        style={[styles.pressable, { pointerEvents: open ? 'auto' : 'none' }]}
        role="button"
        aria-label={accessibilityLabel}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    // Disable touch highlight on mobile Safari.
    // WebkitTapHighlightColor must be used outside of StyleSheet.create because react-native-web will omit the property.
    // @ts-expect-error: WebkitTapHighlightColor is web only
    WebkitTapHighlightColor: 'transparent',
    transition: 'opacity 0.3s',
  },
  pressable: {
    flex: 1,
  },
});
