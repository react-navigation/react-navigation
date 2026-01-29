export const FONT_WEIGHTS = {
  thin: 100,
  ultralight: 200,
  light: 300,
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
  extrabold: 800,
  black: 900,
} as const;

export type FontWeight =
  | keyof typeof FONT_WEIGHTS
  | (typeof FONT_WEIGHTS)[keyof typeof FONT_WEIGHTS];
