import * as React from 'react';
import { NavigationContainerRef } from '@react-navigation/core';

/**
 * Set the document title for the active page
 */
export default function useDocumentTitle(
  ref: React.RefObject<NavigationContainerRef>
) {
  React.useEffect(() => {
    const navigation = ref.current;

    const title =
      // @ts-ignore
      navigation?.getCurrentOptions()?.title ??
      navigation?.getCurrentRoute()?.name;

    if (title != null) {
      document.title = title;
    }

    navigation?.addListener('options', (e) => {
      document.title =
        // @ts-ignore
        e.data.options?.title ?? navigation?.getCurrentRoute()?.name;
    });
  });
}
