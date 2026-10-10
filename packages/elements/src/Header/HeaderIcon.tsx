import {
  type ColorValue,
  Platform,
  type StyleProp,
  StyleSheet,
} from 'react-native';

import { PlatformIcon, type PlatformIconStyle } from '../PlatformIcon';
import type { Icon } from '../types';

type Props = {
  icon: Icon;
  color: ColorValue;
  style?: StyleProp<PlatformIconStyle> | undefined;
};

export function HeaderIcon({ icon, color, style }: Props) {
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

const styles = StyleSheet.create({
  icon: {
    width: ICON_SIZE,
    height: ICON_SIZE,
    margin: ICON_MARGIN,
  },
});
