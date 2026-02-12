import type { Theme } from '@react-navigation/core';

import { fonts } from './fonts';

export const DarkTheme = {
  dark: true,
  colors: {
    primary: 'rgb(10, 132, 255)',
    background: 'rgb(0, 0, 0)',
    card: 'rgb(28, 28, 30)',
    text: 'rgb(255, 255, 255)',
    border: 'rgb(56, 56, 58)',
    notification: 'rgb(255, 69, 58)',
  },
  fonts,
} as const satisfies Theme;
