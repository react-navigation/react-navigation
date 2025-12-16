import {
  type ColorValue,
  type StyleProp,
  StyleSheet,
  type TextStyle,
} from 'react-native';

import { Text } from './Text';

type Props = {
  color?: ColorValue;
  size?: number;
  style?: StyleProp<TextStyle>;
};

export function MissingIcon({ color, size, style }: Props) {
  return (
    <Text aria-hidden style={[styles.icon, { color, fontSize: size }, style]}>
      ⏷
    </Text>
  );
}

const styles = StyleSheet.create({
  icon: {
    backgroundColor: 'transparent',
  },
});
