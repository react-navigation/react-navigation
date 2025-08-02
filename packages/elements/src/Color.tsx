// eslint-disable-next-line no-restricted-imports
import OriginalColor from 'color';
import type { ColorValue } from 'react-native';

type ColorType = {
  isLight(): boolean;
  isDark(): boolean;
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
