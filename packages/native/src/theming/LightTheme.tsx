import type { Theme } from '@react-navigation/core';

import { fonts } from './fonts';

export const LightTheme = {
  dark: false,
  colors: {
    primary: 'rgb(0, 122, 255)',
    background: 'rgb(242, 242, 247)',
    card: 'rgb(255, 255, 255)',
    text: 'rgb(0, 0, 0)',
    border: 'rgb(198, 198, 200)',
    notification: 'rgb(255, 59, 48)',
  },
  fonts,
} as const satisfies Theme;
