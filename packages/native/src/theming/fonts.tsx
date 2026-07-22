import type { Theme } from '@react-navigation/core';

const WEB_FONT_STACK =
  'system-ui, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"';

export const fonts = {
  regular: {
    fontFamily: WEB_FONT_STACK,
    fontWeight: '400',
  },
  medium: {
    fontFamily: WEB_FONT_STACK,
    fontWeight: '500',
  },
  bold: {
    fontFamily: WEB_FONT_STACK,
    fontWeight: '600',
  },
  heavy: {
    fontFamily: WEB_FONT_STACK,
    fontWeight: '700',
  },
} as const satisfies Theme['fonts'];
