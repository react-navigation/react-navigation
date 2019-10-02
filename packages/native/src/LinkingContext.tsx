import * as React from 'react';
import { LinkingOptions } from './types';

const LinkingContext = React.createContext<() => LinkingOptions | undefined>(
  () => {
    throw new Error(
      "Couldn't find a linking context. Have you wrapped your app with 'NavigationContainer'?"
    );
  }
);

export default LinkingContext;
