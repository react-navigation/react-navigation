import * as React from 'react';
import ThemeContext from './ThemeContext';

export default function useTheme() {
  const theme = React.useContext(ThemeContext);

  return theme;
}
