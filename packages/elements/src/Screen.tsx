import {
  NavigationContext,
  NavigationProp,
  NavigationRouteContext,
  ParamListBase,
  RouteProp,
} from '@react-navigation/native';
import * as React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import {
  useSafeAreaFrame,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

import Background from './Background';
import getDefaultHeaderHeight from './Header/getDefaultHeaderHeight';
import HeaderHeightContext from './Header/HeaderHeightContext';
import HeaderShownContext from './Header/HeaderShownContext';

type Props = {
  focused: boolean;
  modal?: boolean;
  navigation: NavigationProp<ParamListBase>;
  route: RouteProp<ParamListBase>;
  header: React.ReactNode;
  headerShown?: boolean;
  headerStatusBarHeight?: number;
  style?: StyleProp<ViewStyle>;
  children: React.ReactNode;
};

export default function Screen(props: Props) {
  const dimensions = useSafeAreaFrame();
  const insets = useSafeAreaInsets();

  const isParentHeaderShown = React.useContext(HeaderShownContext);
  const parentHeaderHeight = React.useContext(HeaderHeightContext);

  const {
    focused,
    modal = false,
    header,
    headerShown = true,
    headerStatusBarHeight = isParentHeaderShown ? 0 : insets.top,
    navigation,
    route,
    children,
    style,
  } = props;

  const [headerHeight, setHeaderHeight] = React.useState(() =>
    getDefaultHeaderHeight(dimensions, modal, headerStatusBarHeight)
  );

  return (
    <Background
      accessibilityElementsHidden={!focused}
      importantForAccessibility={focused ? 'auto' : 'no-hide-descendants'}
      style={[styles.container, style]}
    >
      <View style={styles.content}>
        <HeaderShownContext.Provider
          value={isParentHeaderShown || headerShown !== false}
        >
          <HeaderHeightContext.Provider
            value={headerShown ? headerHeight : parentHeaderHeight ?? 0}
          >
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
    </Background>
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
