import * as React from 'react';
import ThemeContext from './ThemeContext';
import type { Theme } from '../types';

type Props = {
  value: Theme;
  children: React.ReactNode;
};

export default function ThemeProvider({ value, children }: Props) {
  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}
