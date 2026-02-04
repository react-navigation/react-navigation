import { DefaultTheme, type Theme } from '@react-navigation/native';
import { Platform, PlatformColor } from 'react-native';

export const PlatformTheme: Theme = {
  ...DefaultTheme,
  colors: Platform.select<Theme['colors']>({
    ios: {
      primary: PlatformColor('systemRed'),
      background: PlatformColor('systemGroupedBackground'),
      card: PlatformColor('tertiarySystemBackground'),
      text: PlatformColor('label'),
      border: PlatformColor('separator'),
      notification: PlatformColor('systemRed'),
    },
    android: {
      primary: PlatformColor('@android:color/system_accent2_600'),
      background: PlatformColor('@android:color/system_neutral2_50'),
      card: PlatformColor('@android:color/system_neutral2_10'),
      text: PlatformColor('@android:color/system_neutral2_900'),
      border: PlatformColor('@android:color/system_neutral2_300'),
      notification: PlatformColor('@android:color/system_error_600'),
    },
    default: DefaultTheme.colors,
  }),
};
