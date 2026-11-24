import { usePreventRemoveContext } from '@react-navigation/native';
import * as React from 'react';

import type { NativeStackDescriptorMap } from '../types';

export function useInvalidPreventRemoveError(
  descriptors: NativeStackDescriptorMap
) {
  const { preventedRoutes } = usePreventRemoveContext();

  const preventedRouteName = Object.keys(preventedRoutes)
    .map((key) => descriptors[key])
    .find((descriptor) => descriptor?.options.headerBackButtonMenuEnabled)
    ?.route.name;

  React.useEffect(() => {
    if (preventedRouteName != null) {
      const message =
        `The screen ${preventedRouteName} uses 'usePreventRemove' hook alongside 'headerBackButtonMenuEnabled: true', which is not supported. \n\n` +
        `Consider removing 'headerBackButtonMenuEnabled: true' from ${preventedRouteName} screen to get rid of this error.`;
      console.error(message);
    }
  }, [preventedRouteName]);
}
