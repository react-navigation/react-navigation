import * as React from 'react';
import DrawerOpenContext from './DrawerOpenContext';

/**
 * Hook to detect if the drawer is open in a parent navigator.
 */
export default function useIsDrawerOpen() {
  const isDrawerOpen = React.useContext(DrawerOpenContext);

  if (typeof isDrawerOpen !== 'boolean') {
    throw new Error(
      "Couldn't find a drawer. Is your component inside a drawer navigator?"
    );
  }

  return isDrawerOpen;
}
