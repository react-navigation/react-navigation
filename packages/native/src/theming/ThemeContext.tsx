import * as React from 'react';
import DefaultTheme from './DefaultTheme';
import { Theme } from '../types';

const ThemeContext = React.createContext<Theme>(DefaultTheme);

export default ThemeContext;
