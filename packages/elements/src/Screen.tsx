import {
  NavigationContext,
  type NavigationProp,
  NavigationRouteContext,
  type ParamListBase,
  type RouteProp,
} from '@react-navigation/native';
import * as React from 'react';
import {
  Animated,
  type StyleProp,
  StyleSheet,
  View,
  type ViewStyle,
} from 'react-native';
import {
  useSafeAreaFrame,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

import { Background } from './Background';
import { getDefaultHeaderHeight } from './Header/getDefaultHeaderHeight';
import { HeaderHeightContext } from './Header/HeaderHeightContext';
import { HeaderShownContext } from './Header/HeaderShownContext';

type Props = {
  focused: boolean;
  modal?: boolean;
  navigation: NavigationProp<ParamListBase>;
  route: RouteProp<ParamListBase>;
  header: React.ReactNode;
  headerShown?: boolean;
  headerStatusBarHeight?: number;
  headerTransparent?: boolean;
  style?: Animated.WithAnimatedValue<StyleProp<ViewStyle>>;
  children: React.ReactNode;
};

export function Screen(props: Props) {
  const dimensions = useSafeAreaFrame();
  const insets = useSafeAreaInsets();

  const isParentHeaderShown = React.useContext(HeaderShownContext);
  const parentHeaderHeight = React.useContext(HeaderHeightContext);

  const {
    focused,
    modal = false,
    header,
    headerShown = true,
    headerTransparent,
    // eslint-disable-next-line @eslint-react/no-unstable-default-props
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
      // On Fabric we need to disable collapsing for the background to ensure
      // that we won't render unnecessary views due to the view flattening.
      collapsable={false}
    >
      {headerShown ? (
        <NavigationContext.Provider value={navigation}>
          <NavigationRouteContext.Provider value={route}>
            <View
              pointerEvents="box-none"
              onLayout={(e) => {
                const { height } = e.nativeEvent.layout;

                setHeaderHeight(height);
              }}
              style={[
                styles.header,
                headerTransparent ? styles.absolute : null,
              ]}
            >
              {header}
            </View>
          </NavigationRouteContext.Provider>
        </NavigationContext.Provider>
      ) : null}
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
    </Background>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  header: {
    zIndex: 1,
  },
  absolute: {
    position: 'absolute',
    top: 0,
    start: 0,
    end: 0,
  },
});
