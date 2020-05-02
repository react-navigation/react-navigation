import * as React from 'react';
import { SharedScreenNavigationOptions, useIsFocused } from './index';
import NavigationDocumentTitleContext from './NavigationDocumentTitleContext';

let timeout: NodeJS.Timeout | number | undefined;

let nonNavigationTitle: string | undefined;

let recentSetter: string | undefined;

function debounceSetTitle(title: string | undefined, key: string) {
  recentSetter = key;
  if (typeof timeout === 'number') {
    clearTimeout(timeout);
    timeout = undefined;
  }
  timeout = setTimeout(() => {
    if ('document' in window && window.document.createElement) {
      if (nonNavigationTitle === undefined) {
        nonNavigationTitle = window.document.title;
      }
      window.document.title =
        title !== undefined ? title : (nonNavigationTitle as string);
    }
  }, 100);
}

export default function useDocumentTitleContext(
  options: SharedScreenNavigationOptions,
  getKey: () => string | undefined
) {
  const isFocused = useIsFocused();

  const titleContext = React.useContext(NavigationDocumentTitleContext);

  const childTitle = React.useRef<string | undefined>(undefined);

  const newTitleContext = React.useMemo(
    () => ({
      setChildTitle: (newTitle: string | undefined, childKey: string) => {
        childTitle.current = newTitle;
        const title = newTitle === undefined ? options.title : newTitle;
        const newKey = newTitle === undefined ? (getKey() as string) : childKey;
        titleContext?.setChildTitle(title, getKey() as string);
        if (titleContext === undefined) {
          debounceSetTitle(title, newKey);
        }
      },
    }),
    [getKey, options.title, titleContext]
  );

  React.useEffect(() => {
    if (isFocused) {
      const title =
        childTitle.current === undefined ? options.title : childTitle.current;
      if (titleContext) {
        titleContext.setChildTitle(title, getKey() as string);
      } else {
        newTitleContext.setChildTitle(title, getKey() as string);
      }
      return () => {
        if (recentSetter === getKey()) {
          titleContext?.setChildTitle(undefined, getKey() as string);

          if (!titleContext) {
            debounceSetTitle(undefined, getKey() as string);
          }
        }
      };
    }
    return () => null;
  }, [getKey, isFocused, newTitleContext, options.title, titleContext]);

  return newTitleContext;
}
