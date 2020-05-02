import * as React from 'react';
import { ParamListBase } from '@react-navigation/routers';
import { NavigationProp } from './types';
import { MutableRefObject, RefObject } from 'react';

/**
 * TODO
 */
const NavigationDocumentTitleContainer = React.createContext<
  | {
      setChildTitle: (newTitle: string | undefined) => void;
      getChildTitle: () => string | undefined;
    }
  | undefined
>(undefined);

export default NavigationDocumentTitleContainer;
