import * as React from 'react';

// Only light and dark are supported currently. Arbitrary theming not available.
export type ThemeContextType = 'light' | 'dark';
export default React.createContext<ThemeContextType>('light');
