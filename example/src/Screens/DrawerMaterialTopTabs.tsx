import {
  createDrawerNavigator,
  createDrawerScreen,
} from '@react-navigation/drawer';
import { Text } from '@react-navigation/elements';
import {
  createMaterialTopTabNavigator,
  createMaterialTopTabScreen,
} from '@react-navigation/material-top-tabs';
import * as React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { DrawerGestureContext } from 'react-native-drawer-layout';
import {
  GestureDetector,
  useNativeGesture,
} from 'react-native-gesture-handler';
import {
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

const Placeholder = ({ label }: { label: string }) => (
  <View style={styles.container}>
    <Text>{label}</Text>
  </View>
);

const FirstTabScreen = () => <Placeholder label="First tab" />;
const SecondTabScreen = () => <Placeholder label="Second tab" />;
const RegularScreen = () => <Placeholder label="Regular screen" />;

const TopTabsNavigator = createMaterialTopTabNavigator({
  // The edge swipe conflict only happens with the native pager on iOS
  adapter:
    Platform.OS === 'ios'
      ? (props) => <DrawerAwarePagerAdapter {...props} />
      : undefined,
  screens: {
    First: createMaterialTopTabScreen({
      screen: FirstTabScreen,
      options: { title: 'First' },
    }),
    Second: createMaterialTopTabScreen({
      screen: SecondTabScreen,
      options: { title: 'Second' },
    }),
  },
});

const DrawerMaterialTopTabsNavigator = createDrawerNavigator({
  screenOptions: {
    drawerType: 'front',
    swipeEdgeWidth: 100,
  },
  screens: {
    TopTabs: createDrawerScreen({
      screen: TopTabsNavigator,
      options: { title: 'Top Tabs' },
    }),
    Regular: createDrawerScreen({
      screen: RegularScreen,
      options: { title: 'Regular' },
    }),
  },
});

export const DrawerMaterialTopTabs = {
  screen: DrawerMaterialTopTabsNavigator,
  title: 'Drawer - Material Top Tabs',
  options: {
    headerShown: false,
    // The stack's own edge swipe-back gesture would compete with the drawer
    gestureEnabled: false,
  },
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
