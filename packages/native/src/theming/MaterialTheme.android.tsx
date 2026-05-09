import type { Theme } from '@react-navigation/core';
import { Platform, PlatformColor } from 'react-native';

import { fonts } from './fonts';
import {
  MaterialDarkFallbackTheme,
  MaterialLightFallbackTheme,
} from './MaterialFallbackTheme';

const isDynamicThemeSupported =
  Platform.OS === 'android' && Platform.Version >= 34;

const MaterialLightDynamicTheme = {
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

const MaterialDarkDynamicTheme = {
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

export const MaterialLightTheme = isDynamicThemeSupported
  ? MaterialLightDynamicTheme
  : MaterialLightFallbackTheme;

export const MaterialDarkTheme = isDynamicThemeSupported
  ? MaterialDarkDynamicTheme
  : MaterialDarkFallbackTheme;
