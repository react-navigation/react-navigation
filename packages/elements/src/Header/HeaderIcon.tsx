import { SFSymbol, type SFSymbolProps } from '@react-navigation/native';
import {
  type ColorValue,
  Platform,
  type StyleProp,
  StyleSheet,
} from 'react-native';

import { isLiquidGlassSupported } from '../LiquidGlassView';
import { PlatformIcon, type PlatformIconStyle } from '../PlatformIcon';
import type { Icon } from '../types';

type Props = {
  /**
   * The icon to display in the header.
   */
  icon: Icon;
  /**
   * The color of the icon.
   */
  color: ColorValue;
  /**
   * Weight of the symbol when the icon is an SF Symbol.
   */
  weight?: SFSymbolProps['weight'];
  /**
   * Style for the icon.
   */
  style?: StyleProp<PlatformIconStyle> | undefined;
};

export function HeaderIcon({
  icon,
  color,
  weight = SF_SYMBOL_WEIGHT,
  style,
}: Props) {
  if (icon.type === 'sfSymbol') {
    return (
      <SFSymbol
        name={icon.name}
        renderingMode={icon.renderingMode}
        color={color}
        size={SF_SYMBOL_SIZE}
        scale="large"
        weight={weight}
        style={StyleSheet.flatten([styles.icon, style]) ?? undefined}
      />
    );
  }

  return (
    <PlatformIcon
      icon={icon}
      color={color}
      size={ICON_SIZE}
      style={[styles.icon, style]}
    />
  );
}

const ICON_SIZE = Platform.OS === 'ios' ? 21 : 24;
const ICON_MARGIN = Platform.OS === 'ios' ? 8 : 3;

// The size of SF Symbols is not the size of the drawn glyph, but a font point size
// With the large scale, we get about 21pt (same as `ICON_SIZE`) when the size is 17pt
const SF_SYMBOL_SIZE = 17;

// Native navigation bars use a heavier weight for symbols with liquid glass
const SF_SYMBOL_WEIGHT = isLiquidGlassSupported ? 'medium' : 'regular';

const styles = StyleSheet.create({
  icon: {
    width: ICON_SIZE,
    height: ICON_SIZE,
    margin: ICON_MARGIN,
  },
});
