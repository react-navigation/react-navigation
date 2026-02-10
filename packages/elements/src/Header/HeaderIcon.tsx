import { MaterialSymbol, SFSymbol, useLocale } from '@react-navigation/native';
import {
  type ColorValue,
  Image,
  type ImageProps,
  Platform,
  StyleSheet,
} from 'react-native';

import type { HeaderIcon as HeaderIconType } from '../types';

type Props = Omit<ImageProps, 'source'> & {
  icon: HeaderIconType;
  color: ColorValue;
};

export function HeaderIcon({ icon, color, style, ...rest }: Props) {
  const { direction } = useLocale();

  const iconStyle = [styles.icon, direction === 'rtl' && styles.flip, style];

  if (icon.type === 'sfSymbol') {
    return (
      <SFSymbol
        name={icon.name}
        color={color}
        size={ICON_SIZE}
        style={iconStyle}
        {...rest}
      />
    );
  }

  if (icon.type === 'materialSymbol') {
    return (
      <MaterialSymbol
        name={icon.name}
        variant={icon.variant}
        weight={icon.weight}
        color={color}
        size={ICON_SIZE}
        style={iconStyle}
        {...rest}
      />
    );
  }

  return (
    <Image
      source={icon.source}
      resizeMode="contain"
      fadeDuration={0}
      tintColor={color}
      style={iconStyle}
      {...rest}
    />
  );
}

const ICON_SIZE = Platform.OS === 'ios' ? 21 : 24;
const ICON_MARGIN = Platform.OS === 'ios' ? 8 : 3;

const styles = StyleSheet.create({
  icon: {
    width: ICON_SIZE,
    height: ICON_SIZE,
    margin: ICON_MARGIN,
  },
  flip: {
    transform: 'scaleX(-1)',
  },
});
