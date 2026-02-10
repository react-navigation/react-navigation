import { HeaderButton, type HeaderIcon } from '@react-navigation/elements';
import {
  DrawerActions,
  MaterialSymbol,
  SFSymbol,
  useNavigation,
} from '@react-navigation/native';
import * as React from 'react';
import { type ColorValue, Image, Platform, StyleSheet } from 'react-native';

import toggleDrawerIcon from './assets/toggle-drawer-icon.png';

type Props = {
  icon?:
    | HeaderIcon
    | ((props: { tintColor: ColorValue | undefined }) => React.ReactNode);
  accessibilityLabel?: string;
  pressColor?: ColorValue;
  pressOpacity?: number;
  tintColor?: ColorValue;
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
    Platform.select<HeaderIcon>({
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
      ) : drawerIcon.type === 'sfSymbol' ? (
        <SFSymbol
          name={drawerIcon.name}
          size={ICON_SIZE}
          color={tintColor}
          style={styles.icon}
        />
      ) : drawerIcon.type === 'materialSymbol' ? (
        <MaterialSymbol
          name={drawerIcon.name}
          variant={drawerIcon.variant}
          weight={drawerIcon.weight}
          size={ICON_SIZE}
          color={tintColor}
          style={styles.icon}
        />
      ) : (
        <Image
          resizeMode="contain"
          source={drawerIcon.source}
          fadeDuration={0}
          tintColor={tintColor}
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
