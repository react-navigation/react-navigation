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
      primary: PlatformColor('@android:color/system_primary_light'),
      background: PlatformColor(
        '@android:color/system_surface_container_light'
      ),
      card: PlatformColor('@android:color/system_background_light'),
      text: PlatformColor('@android:color/system_on_surface_light'),
      border: PlatformColor('@android:color/system_outline_variant_light'),
      notification: PlatformColor('@android:color/system_error_light'),
    },
    default: DefaultTheme.colors,
  }),
};
