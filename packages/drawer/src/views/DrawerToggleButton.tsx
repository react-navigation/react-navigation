import * as React from 'react';
import { Image, Platform, StyleSheet } from 'react-native';
import { PlatformPressable } from '@react-navigation/elements';
import {
  useNavigation,
  DrawerActions,
  ParamListBase,
} from '@react-navigation/native';
import type { DrawerNavigationProp } from '../types';

type Props = {
  accessibilityLabel?: string;
  pressColor?: string;
  pressOpacity?: number;
  tintColor?: string;
};

export default function DrawerToggleButton({ tintColor, ...rest }: Props) {
  const navigation = useNavigation<DrawerNavigationProp<ParamListBase>>();

  return (
    <PlatformPressable
      {...rest}
      accessible
      accessibilityRole="button"
      delayPressIn={0}
      onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
      style={styles.touchable}
      hitSlop={Platform.select({
        ios: undefined,
        default: { top: 16, right: 16, bottom: 16, left: 16 },
      })}
      borderless
    >
      <Image
        style={[styles.icon, tintColor ? { tintColor } : null]}
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
    resizeMode: 'contain',
  },
  touchable: {
    marginHorizontal: 11,
  },
});
