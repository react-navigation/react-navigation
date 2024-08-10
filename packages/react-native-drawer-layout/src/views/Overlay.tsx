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
        styles.overlay,
        { opacity: open ? 1 : 0, pointerEvents: open ? 'auto' : 'none' },
        style,
      ]}
      accessibilityElementsHidden={!open}
      importantForAccessibility={open ? 'auto' : 'no-hide-descendants'}
    >
      <Pressable
        onPress={onPress}
        style={[styles.pressable, { pointerEvents: open ? 'auto' : 'none' }]}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
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
