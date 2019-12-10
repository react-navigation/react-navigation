import * as React from 'react';
import { useTheme as useThemeBase, ThemeColors } from 'react-navigation';

export default function useTheme() {
  const theme = useThemeBase();

  return React.useMemo(() => {
    const colors = ThemeColors[theme];
    const dark = theme === 'dark';

    return {
      dark,
      colors: {
        primary: dark ? 'rgb(10, 132, 255)' : 'rgb(0, 122, 255)',
        background: dark ? 'rgb(1, 1, 1)' : 'rgb(242, 242, 242)',
        card: colors.header,
        text: colors.label,
        border: colors.headerBorder,
      },
    };
  }, [theme]);
}
