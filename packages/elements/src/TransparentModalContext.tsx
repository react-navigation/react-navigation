import * as React from 'react';

/**
 * Context to track whether a transparent modal is currently being displayed.
 * When true, other navigation elements (headers, tab bars) should be hidden from screen readers.
 */
export const TransparentModalContext = React.createContext(false);
