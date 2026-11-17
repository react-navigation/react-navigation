import * as React from 'react';
import { Platform } from 'react-native';
import { DrawerGestureContext } from 'react-native-drawer-layout';
import {
  GestureDetector,
  useNativeGesture,
} from 'react-native-gesture-handler';
import {
  type AdapterProps,
  PagerViewAdapter,
  type PagerViewAdapterProps,
} from 'react-native-tab-view';

// The pager and the drawer both handle horizontal swipes
// Make the pager wait for the drawer's swipe gesture to fail before handling it
// So that swiping from the edge of the screen opens the drawer instead of switching tabs
const DrawerAwarePagerAdapter = ({
  children,
  ...rest
}: PagerViewAdapterProps) => {
  const drawerGesture = React.useContext(DrawerGestureContext);
  const pagerGesture = useNativeGesture({ requireToFail: drawerGesture });

  return (
    <PagerViewAdapter {...rest}>
      {(props) =>
        children({
          ...props,
          render: (pages) => (
            <GestureDetector gesture={pagerGesture}>
              {props.render(pages) as React.ReactElement}
            </GestureDetector>
          ),
        })
      }
    </PagerViewAdapter>
  );
};

// The edge swipe conflict only happens with the native pager on iOS
export const drawerAwareAdapter:
  | ((props: AdapterProps) => React.ReactElement)
  | undefined =
  Platform.OS === 'ios'
    ? (props) => <DrawerAwarePagerAdapter {...props} />
    : undefined;
