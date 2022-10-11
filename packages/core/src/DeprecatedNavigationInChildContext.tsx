import * as React from 'react';

/**
 * Context which enables deprecated bubbling to child navigators.
 */
const DeprecatedNavigationInChildContext = React.createContext(false);

export default DeprecatedNavigationInChildContext;
