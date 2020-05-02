import * as React from 'react';

/**
 * Context which holds data for proper setting title of document on web
 */
const NavigationDocumentTitleContainer = React.createContext<
  | {
      setChildTitle: (newTitle: string | undefined, key: string) => void;
    }
  | undefined
>(undefined);

export default NavigationDocumentTitleContainer;
