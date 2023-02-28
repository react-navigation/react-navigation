import * as React from 'react';

import type { Theme } from '../types';
import { ThemeContext } from './ThemeContext';

type Props = {
  value: Theme;
  children: React.ReactNode;
};

export function ThemeProvider({ value, children }: Props) {
  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}
