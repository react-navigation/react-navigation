import { useLocale } from '@react-navigation/native';
import {
  type ColorValue,
  type ImageStyle,
  Platform,
  type StyleProp,
  StyleSheet,
} from 'react-native';

import { PlatformIcon } from '../PlatformIcon';
import type { Icon } from '../types';

type Props = {
  icon: Icon;
  color: ColorValue;
  style?: StyleProp<ImageStyle> | undefined;
};

export function HeaderIcon({ icon, color, style }: Props) {
  const { direction } = useLocale();

  const iconStyle = [styles.icon, direction === 'rtl' && styles.flip, style];

  return (
    <PlatformIcon
      icon={icon}
      color={color}
      size={ICON_SIZE}
      style={iconStyle}
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
