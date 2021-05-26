import * as React from 'react';

import type { Theme } from '../types';
import DefaultTheme from './DefaultTheme';

const ThemeContext = React.createContext<Theme>(DefaultTheme);

ThemeContext.displayName = 'ThemeContext';

export default ThemeContext;
