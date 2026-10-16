import * as React from 'react';

/**
 * Context with additional metadata to pass to child navigators in a screen.
 *
 * Consumers should not make any assumptions about the shape of the object.
 * It can be different depending on the navigator and may change without notice.
 * This is not intended to be used by application code.
 *
 * @deprecated
 */
export const NavigationMetaContext = React.createContext<object | undefined>(
  undefined
);
