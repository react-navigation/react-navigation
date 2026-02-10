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
      primary: PlatformColor('?attr/colorPrimary'),
      background: PlatformColor('?attr/colorBackground'),
      card: PlatformColor('?attr/colorBackgroundFloating'),
      text: PlatformColor('?attr/colorForeground'),
      border: PlatformColor('@android:color/darker_gray'),
      notification: PlatformColor('?attr/colorError'),
    },
    default: DefaultTheme.colors,
  }),
};
