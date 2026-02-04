import type { Theme } from '@react-navigation/core';
import { PlatformColor } from 'react-native';

import { fonts } from './fonts';

export const MaterialLightTheme = {
  dark: false,
  colors: {
    primary: PlatformColor('@android:color/system_primary_light'),
    background: PlatformColor('@android:color/system_surface_container_light'),
    card: PlatformColor('@android:color/system_background_light'),
    text: PlatformColor('@android:color/system_on_surface_light'),
    border: PlatformColor('@android:color/system_outline_variant_light'),
    notification: PlatformColor('@android:color/system_error_light'),
  },
  fonts,
} as const satisfies Theme;

export const MaterialDarkTheme = {
  dark: true,
  colors: {
    primary: PlatformColor('@android:color/system_primary_dark'),
    background: PlatformColor('@android:color/system_surface_container_dark'),
    card: PlatformColor('@android:color/system_background_dark'),
    text: PlatformColor('@android:color/system_on_surface_dark'),
    border: PlatformColor('@android:color/system_outline_variant_dark'),
    notification: PlatformColor('@android:color/system_error_dark'),
  },
  fonts,
} as const satisfies Theme;
