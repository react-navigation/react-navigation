import { MaterialSymbol, SFSymbol } from '@react-navigation/native';
import {
  type ColorValue,
  Image,
  type ImageStyle,
  type StyleProp,
  StyleSheet,
  type ViewStyle,
} from 'react-native';

import type { Icon } from './types';

export type PlatformIconStyle = React.CSSProperties & ImageStyle & ViewStyle;

export type PlatformIconProps = {
  icon: Icon;
  size: number;
  color?: ColorValue | undefined;
  style?: StyleProp<PlatformIconStyle> | undefined;
};

export function PlatformIcon({
  icon,
  color,
  size,
  style,
  ...rest
}: PlatformIconProps) {
  switch (icon.type) {
    case 'sfSymbol':
      return (
        <SFSymbol
          name={icon.name}
          color={color}
          size={size}
          style={StyleSheet.flatten(style)}
          {...rest}
        />
      );
    case 'materialSymbol':
      return (
        <MaterialSymbol
          name={icon.name}
          variant={icon.variant}
          weight={icon.weight}
          size={size}
          color={color}
          style={StyleSheet.flatten(style)}
          {...rest}
        />
      );
    case 'image':
      return (
        <Image
          source={icon.source}
          resizeMode="contain"
          fadeDuration={0}
          tintColor={icon.tinted === false ? undefined : color}
          style={[
            {
              width: size,
              height: size,
            },
            style,
          ]}
          {...rest}
        />
      );
  }
}
