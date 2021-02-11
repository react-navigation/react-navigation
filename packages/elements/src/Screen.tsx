import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import {
  useSafeAreaFrame,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import {
  NavigationContext,
  NavigationRouteContext,
  NavigationProp,
  RouteProp,
  ParamListBase,
} from '@react-navigation/native';

import HeaderShownContext from './Header/HeaderShownContext';
import HeaderHeightContext from './Header/HeaderHeightContext';
import getDefaultHeaderHeight from './Header/getDefaultHeaderHeight';

type Props = {
  navigation: NavigationProp<ParamListBase>;
  route: RouteProp<ParamListBase, string>;
  header: React.ReactNode;
  headerShown?: boolean;
  headerStatusBarHeight?: number;
  children: React.ReactNode;
};

export default function Screen(props: Props) {
  const dimensions = useSafeAreaFrame();
  const insets = useSafeAreaInsets();

  const isParentHeaderShown = React.useContext(HeaderShownContext);

  const {
    header,
    headerShown = true,
    headerStatusBarHeight = isParentHeaderShown ? 0 : insets.top,
    children,
    navigation,
    route,
  } = props;

  const [headerHeight, setHeaderHeight] = React.useState(() =>
    getDefaultHeaderHeight(dimensions, headerStatusBarHeight)
  );

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <HeaderShownContext.Provider
          value={isParentHeaderShown || headerShown !== false}
        >
          <HeaderHeightContext.Provider value={headerShown ? headerHeight : 0}>
            {children}
          </HeaderHeightContext.Provider>
        </HeaderShownContext.Provider>
      </View>
      {headerShown ? (
        <NavigationContext.Provider value={navigation}>
          <NavigationRouteContext.Provider value={route}>
            <View
              onLayout={(e) => {
                const { height } = e.nativeEvent.layout;

                setHeaderHeight(height);
              }}
            >
              {header}
            </View>
          </NavigationRouteContext.Provider>
        </NavigationContext.Provider>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column-reverse',
  },
  // This is necessary to avoid applying 'column-reverse' to screen content
  content: {
    flex: 1,
  },
});
