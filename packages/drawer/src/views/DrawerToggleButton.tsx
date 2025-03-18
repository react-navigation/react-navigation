import { PlatformPressable } from "@react-navigation/elements";
import {
  DrawerActions,
  type ParamListBase,
  useNavigation,
} from "@react-navigation/native";
import { Image, Platform, StyleSheet } from "react-native";

import type { DrawerNavigationProp } from "../types";
import toggleDrawerIcon from "./assets/toggle-drawer-icon.png";

type Props = {
  accessibilityLabel?: string;
  pressColor?: string;
  pressOpacity?: number;
  tintColor?: string;
  iconSource?:
    | number
    | string
    | { uri: string }
    | { uri?: string; [key: string]: any };
};

export function DrawerToggleButton({
  tintColor,
  accessibilityLabel = "Show navigation menu",
  iconSource = toggleDrawerIcon,
  ...rest
}: Props) {
  const navigation = useNavigation<DrawerNavigationProp<ParamListBase>>();

  const imageSource =
    typeof iconSource === "string" ? { uri: iconSource } : iconSource;

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
        source={imageSource}
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
