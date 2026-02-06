// eslint-disable-next-line no-restricted-imports
import OriginalColor from 'color';
import { type ColorValue, Platform } from 'react-native';

import { DynamicColorIOS, PlatformColor } from './PlatformColor';

type ColorType = {
  alpha(amount: number): ColorType;
  alpha(): number;
  fade(amount: number): ColorType;
  darken(amount: number): ColorType;
  string(): string;
};

export function Color(value: ColorValue): ColorType | undefined {
  if (typeof value === 'string' && !value.startsWith('var(')) {
    return OriginalColor(value);
  }

  return undefined;
}

Color.foreground = (color: ColorValue): ColorValue => {
  const value = color as unknown;

  if (typeof value === 'object' && value != null) {
    // Special case for Android platform colors
    // Available colors: https://developer.android.com/reference/android/R.color
    if (
      Platform.OS === 'android' &&
      PlatformColor &&
      'resource_paths' in value &&
      Array.isArray(value.resource_paths) &&
      typeof value.resource_paths[0] === 'string'
    ) {
      const name = value.resource_paths[0].replace('@android:color/', '');

      if (name in ANDROID_COLOR_MAP) {
        return PlatformColor(`@android:color/${ANDROID_COLOR_MAP[name]}`);
      }
    }

    // Special case for iOS platform colors
    if (
      Platform.OS === 'ios' &&
      PlatformColor &&
      'semantic' in value &&
      Array.isArray(value.semantic) &&
      typeof value.semantic[0] === 'string'
    ) {
      const name = value.semantic[0];

      if (name in IOS_COLOR_MAP) {
        const foreground = IOS_COLOR_MAP[name];
        return foreground === 'white' || foreground === 'black'
          ? foreground
          : PlatformColor(foreground);
      }
    }

    // Special case for iOS dynamic colors
    if (
      Platform.OS === 'ios' &&
      DynamicColorIOS &&
      'dynamic' in value &&
      typeof value.dynamic === 'object' &&
      value.dynamic != null &&
      'light' in value.dynamic &&
      typeof value.dynamic.light === 'string' &&
      'dark' in value.dynamic &&
      typeof value.dynamic.dark === 'string'
    ) {
      const lightForeground = Color.foreground(value.dynamic.light);
      const darkForeground = Color.foreground(value.dynamic.dark);

      if (lightForeground && darkForeground) {
        return DynamicColorIOS({
          light: lightForeground,
          dark: darkForeground,
        });
      }
    }
  } else if (typeof color === 'string' && !color.startsWith('var(')) {
    const processed = OriginalColor(color);

    if (processed.isLight()) {
      return processed.darken(0.71).string();
    }
  }

  return '#fff';
};

const ANDROID_COLOR_MAP: Record<string, string> = {
  system_background_dark: 'system_on_background_dark',
  system_background_light: 'system_on_background_light',
  system_error_container_dark: 'system_on_error_container_dark',
  system_error_container_light: 'system_on_error_container_light',
  system_error_dark: 'system_on_error_dark',
  system_error_light: 'system_on_error_light',
  system_primary_container_dark: 'system_on_primary_container_dark',
  system_primary_container_light: 'system_on_primary_container_light',
  system_primary_dark: 'system_on_primary_dark',
  system_primary_fixed: 'system_on_primary_fixed',
  system_primary_light: 'system_on_primary_light',
  system_secondary_container_dark: 'system_on_secondary_container_dark',
  system_secondary_container_light: 'system_on_secondary_container_light',
  system_secondary_dark: 'system_on_secondary_dark',
  system_secondary_fixed: 'system_on_secondary_fixed',
  system_secondary_light: 'system_on_secondary_light',
  system_surface_dark: 'system_on_surface_dark',
  system_surface_disabled: 'system_on_surface_disabled',
  system_surface_light: 'system_on_surface_light',
  system_surface_variant_dark: 'system_on_surface_variant_dark',
  system_surface_variant_light: 'system_on_surface_variant_light',
};

const IOS_COLOR_MAP: Record<string, string> = {
  systemBackground: 'label',
  secondarySystemBackground: 'label',
  tertiarySystemBackground: 'label',
  systemGroupedBackground: 'label',
  secondarySystemGroupedBackground: 'label',
  tertiarySystemGroupedBackground: 'label',

  systemFill: 'label',
  secondarySystemFill: 'label',
  tertiarySystemFill: 'label',
  quaternarySystemFill: 'label',

  systemRed: 'white',
  systemGreen: 'white',
  systemBlue: 'white',
  systemIndigo: 'white',
  systemPurple: 'white',
  systemBrown: 'white',

  systemOrange: 'black',
  systemYellow: 'black',
  systemMint: 'black',
  systemTeal: 'black',
  systemCyan: 'black',
  systemPink: 'black',

  systemGray: 'label',
  systemGray2: 'label',
  systemGray3: 'label',
  systemGray4: 'label',
  systemGray5: 'label',
  systemGray6: 'label',
};
