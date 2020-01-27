import * as React from 'react';
import { useNavigation, ParamListBase } from '@react-navigation/native';
import { DrawerNavigationProp } from '../types';

/**
 * Hook to detect if the drawer is open in a parent navigator.
 */
export default function useIsDrawerOpen() {
  const navigation = useNavigation();

  let drawer = navigation as DrawerNavigationProp<ParamListBase>;

  // The screen might be inside another navigator such as stack nested in drawer
  // We need to find the closest drawer navigator and add the listener there
  while (drawer && drawer.dangerouslyGetState().type !== 'drawer') {
    drawer = drawer.dangerouslyGetParent();
  }

  const [isDrawerOpen, setIsDrawerOpen] = React.useState(() =>
    drawer ? drawer.dangerouslyGetState().isDrawerOpen : false
  );

  React.useEffect(() => {
    const unsubscribe = drawer.addListener('state', e => {
      setIsDrawerOpen(e.data.state.isDrawerOpen);
    });

    return unsubscribe;
  }, [drawer]);

  return isDrawerOpen;
}
