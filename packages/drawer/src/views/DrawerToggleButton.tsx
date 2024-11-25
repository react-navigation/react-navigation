import { PlatformPressable } from '@react-navigation/elements';
import {
  DrawerActions,
  type ParamListBase,
  useNavigation,
} from '@react-navigation/native';
import { Image, Platform, StyleSheet } from 'react-native';

import type { DrawerNavigationProp } from '../types';
import toggleDrawerIcon from './assets/toggle-drawer-icon.png';

type Props = {
  accessibilityLabel?: string;
  pressColor?: string;
  pressOpacity?: number;
  tintColor?: string;
};

export function DrawerToggleButton({
  tintColor,
  accessibilityLabel = 'Show navigation menu',
  ...rest
}: Props) {
  const navigation = useNavigation<DrawerNavigationProp<ParamListBase>>();

  return (
    <PlatformPressable
      {...rest}
      accessibilityLabel={accessibilityLabel}
      android_ripple={{ borderless: true }}
      onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
      style={styles.touchable}
      hitSlop={Platform.select({
        ios: undefined,
        default: { top: 16, right: 16, bottom: 16, left: 16 },
      })}
    >
      <Image
        resizeMode="contain"
        source={toggleDrawerIcon}
        fadeDuration={0}
        tintColor={tintColor}
        style={styles.icon}
      />
    </PlatformPressable>
  );
}

const styles = StyleSheet.create({
  icon: {
    height: 24,
    width: 24,
    marginVertical: 8,
    marginHorizontal: 13,
  },
  touchable: {
    // Roundness for iPad hover effect
    borderRadius: 10,
  },
});
