import type { Theme } from '@react-navigation/core';

import { fonts } from './fonts';

export const MaterialLightFallbackTheme = {
  dark: false,
  colors: {
    primary: '#6750a4',
    background: '#f3edf7',
    card: '#fef7ff',
    text: '#1d1b20',
    border: '#cac4d0',
    notification: '#ba1a1a',
  },
  fonts,
} as const satisfies Theme;

export const MaterialDarkFallbackTheme = {
  dark: true,
  colors: {
    primary: '#d0bcff',
    background: '#211f26',
    card: '#141218',
    text: '#e6e0e9',
    border: '#49454f',
    notification: '#ffb4ab',
  },
  fonts,
} as const satisfies Theme;
