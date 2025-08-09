import { HeaderButton } from '@react-navigation/elements';
import {
  DrawerActions,
  type ParamListBase,
  useNavigation,
} from '@react-navigation/native';
import {
  type ColorValue,
  Image,
  type ImageSourcePropType,
  StyleSheet,
} from 'react-native';

import type { DrawerNavigationProp } from '../types';
import toggleDrawerIcon from './assets/toggle-drawer-icon.png';

type Props = {
  accessibilityLabel?: string;
  pressColor?: ColorValue;
  pressOpacity?: number;
  tintColor?: ColorValue;
  imageSource?: ImageSourcePropType;
};

export function DrawerToggleButton({
  tintColor,
  accessibilityLabel = 'Show navigation menu',
  imageSource = toggleDrawerIcon,
  ...rest
}: Props) {
  const navigation = useNavigation<DrawerNavigationProp<ParamListBase>>();

  return (
    <HeaderButton
      {...rest}
      accessibilityLabel={accessibilityLabel}
      onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
    >
      <Image
        resizeMode="contain"
        source={imageSource}
        fadeDuration={0}
        tintColor={tintColor}
        style={styles.icon}
      />
    </HeaderButton>
  );
}

const styles = StyleSheet.create({
  icon: {
    height: 24,
    width: 24,
    marginVertical: 8,
    marginHorizontal: 5,
  },
});
