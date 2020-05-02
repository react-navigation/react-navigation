import * as React from 'react';
import { SharedScreenNavigationOptions, useIsFocused } from './index';
import NavigationDocumentTitleContext from './NavigationDocumentTitleContext';

let timeout: NodeJS.Timeout | number | undefined;

let nonNavigationTitle: string | undefined;

function debounceSetTitle(title: string | undefined) {
  if (typeof timeout === 'number') {
    clearTimeout(timeout);
    timeout = undefined;
  }
  timeout = setTimeout(() => {
    if ('document' in window && window.document.createElement) {
      if (nonNavigationTitle === undefined) {
        nonNavigationTitle = window.document.title;
      }
      window.document.title = title ? title : (nonNavigationTitle as string);
    }
  }, 100);
}

export default function useDocumentTitleContext(
  options: SharedScreenNavigationOptions
) {
  const isFocused = useIsFocused();

  const titleContext = React.useContext(NavigationDocumentTitleContext);

  const childTitle = React.useRef<string | undefined>(undefined);

  const newTitleContext = React.useMemo(
    () => ({
      setChildTitle: (newTitle: string | undefined) => {
        childTitle.current = newTitle;
        const title = newTitle === undefined ? options.title : newTitle;
        titleContext?.setChildTitle(title);
        if (titleContext === undefined) {
          debounceSetTitle(title);
        }
      },
      getChildTitle: () => childTitle.current,
    }),
    [options.title, titleContext]
  );

  React.useEffect(() => {
    if (isFocused) {
      const title =
        childTitle.current === undefined ? options.title : childTitle.current;
      if (titleContext) {
        titleContext.setChildTitle(title);
      } else {
        newTitleContext.setChildTitle(title);
      }
      return () => {
        // check if it's not set by another child already mounted
        if (titleContext?.getChildTitle() === title) {
          titleContext?.setChildTitle(undefined);
        }

        if (!titleContext) {
          if (window?.document?.title === title) {
            debounceSetTitle(undefined);
          }
        }
      };
    }
    return () => null;
  }, [isFocused, options.title, titleContext]);

  return newTitleContext;
}
