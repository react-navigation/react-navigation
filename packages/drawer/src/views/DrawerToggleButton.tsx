import { PlatformPressable } from '@react-navigation/elements';
import {
  DrawerActions,
  type ParamListBase,
  useNavigation,
} from '@react-navigation/native';
import * as React from 'react';
import { Image, Platform, StyleSheet } from 'react-native';

import type { DrawerNavigationProp } from '../types';

type Props = {
  accessibilityLabel?: string;
  pressColor?: string;
  pressOpacity?: number;
  tintColor?: string;
};

export function DrawerToggleButton({ tintColor, ...rest }: Props) {
  const navigation = useNavigation<DrawerNavigationProp<ParamListBase>>();

  return (
    <PlatformPressable
      {...rest}
      android_ripple={{ borderless: true }}
      onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
      style={styles.touchable}
      hitSlop={Platform.select({
        ios: undefined,
        default: { top: 16, right: 16, bottom: 16, left: 16 },
      })}
    >
      <Image
        style={[styles.icon, tintColor ? { tintColor } : null]}
        resizeMode="contain"
        source={require('./assets/toggle-drawer-icon.png')}
        fadeDuration={0}
      />
    </PlatformPressable>
  );
}

const styles = StyleSheet.create({
  icon: {
    height: 24,
    width: 24,
    margin: 3,
  },
  touchable: {
    marginHorizontal: 11,
  },
});
