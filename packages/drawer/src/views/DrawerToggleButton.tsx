import {
  HeaderButton,
  type Icon,
  PlatformIcon,
} from '@react-navigation/elements';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import * as React from 'react';
import { type ColorValue, Platform, StyleSheet } from 'react-native';

import toggleDrawerIcon from './assets/toggle-drawer-icon.png';

type Props = {
  icon?:
    | Icon
    | ((props: { tintColor: ColorValue | undefined }) => React.ReactNode)
    | undefined;
  accessibilityLabel?: string | undefined;
  pressColor?: ColorValue | undefined;
  pressOpacity?: number | undefined;
  tintColor?: ColorValue | undefined;
  testID?: string | undefined;
};

export function DrawerToggleButton({
  icon,
  tintColor,
  accessibilityLabel = 'Show navigation menu',
  ...rest
}: Props) {
  const navigation = useNavigation();

  const drawerIcon =
    icon ??
    Platform.select<Icon>({
      ios: {
        type: 'sfSymbol',
        name: 'line.3.horizontal',
      },
      android: {
        type: 'materialSymbol',
        name: 'menu',
      },
      default: {
        type: 'image',
        source: toggleDrawerIcon,
      },
    });

  return (
    <HeaderButton
      {...rest}
      accessibilityLabel={accessibilityLabel}
      onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
    >
      {typeof drawerIcon === 'function' ? (
        drawerIcon({ tintColor })
      ) : (
        <PlatformIcon
          icon={drawerIcon}
          size={ICON_SIZE}
          color={tintColor}
          style={styles.icon}
        />
      )}
    </HeaderButton>
  );
}

const ICON_SIZE = 24;

const styles = StyleSheet.create({
  icon: {
    height: ICON_SIZE,
    width: ICON_SIZE,
    marginVertical: 8,
    marginHorizontal: 5,
  },
});
