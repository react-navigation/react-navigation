import * as React from 'react';

import { ThemeContext } from './ThemeContext';

export function useTheme() {
  const theme = React.use(ThemeContext);

  if (theme == null) {
    throw new Error(
      "Couldn't find a theme. Is your component inside NavigationContainer or a ThemeProvider?"
    );
  }

  return theme;
}
