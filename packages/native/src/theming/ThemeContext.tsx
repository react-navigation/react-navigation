import * as React from 'react';
import DefaultTheme from './DefaultTheme';
import type { Theme } from '../types';

const ThemeContext = React.createContext<Theme>(DefaultTheme);

ThemeContext.displayName = 'ThemeContext';

export default ThemeContext;
