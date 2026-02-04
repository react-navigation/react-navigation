import type { Theme } from '@react-navigation/core';

import { fonts } from './fonts';

export const MaterialLightTheme = {
  dark: false,
  get colors(): Theme['colors'] {
    throw new Error('MaterialLightTheme is only supported on Android');
  },
  fonts,
} as const satisfies Theme;

export const MaterialDarkTheme = {
  dark: true,
  get colors(): Theme['colors'] {
    throw new Error('MaterialDarkTheme is only supported on Android');
  },
  fonts,
} as const satisfies Theme;
