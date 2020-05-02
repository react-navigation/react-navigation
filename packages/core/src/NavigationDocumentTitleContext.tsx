import * as React from 'react';

/**
 * Context which holds data for proper setting title of document on web
 */
const NavigationDocumentTitleContainer = React.createContext<
  | {
      setChildTitle: (newTitle: string | undefined) => void;
      getChildTitle: () => string | undefined;
    }
  | undefined
>(undefined);

export default NavigationDocumentTitleContainer;
