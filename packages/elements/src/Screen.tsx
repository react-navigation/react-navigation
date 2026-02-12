import {
  type NavigationProp,
  NavigationProvider,
  type ParamListBase,
  type RouteProp,
  useTheme,
} from '@react-navigation/native';
import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { getDefaultHeaderHeight } from './Header/getDefaultHeaderHeight';
import { HeaderHeightContext } from './Header/HeaderHeightContext';
import { HeaderShownContext } from './Header/HeaderShownContext';
import { Container } from './internal';
import { useFrameSize } from './useFrameSize';

type Props = {
  focused: boolean;
  modal?: boolean;
  navigation: NavigationProp<ParamListBase>;
  route: RouteProp<ParamListBase>;
  header: React.ReactNode;
  headerShown?: boolean;
  headerStatusBarHeight?: number;
  headerTransparent?: boolean;
  style?: React.ComponentProps<typeof Container>['style'];
  children: React.ReactNode;
};

export function Screen(props: Props) {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();

  const isParentHeaderShown = React.useContext(HeaderShownContext);
  const parentHeaderHeight = React.useContext(HeaderHeightContext);

  const {
    focused,
    modal = false,
    header,
    headerShown = true,
    headerTransparent,
    headerStatusBarHeight = isParentHeaderShown ? 0 : insets.top,
    navigation,
    route,
    children,
    style,
  } = props;

  const defaultHeaderHeight = useFrameSize((size) =>
    getDefaultHeaderHeight({
      landscape: size.width > size.height,
      modalPresentation: modal,
      topInset: headerStatusBarHeight,
    })
  );

  const headerRef = React.useRef<View>(null);

  const [headerHeight, setHeaderHeight] = React.useState(defaultHeaderHeight);

  React.useLayoutEffect(() => {
    headerRef.current?.measure((_x, _y, _width, height) => {
      setHeaderHeight(height);
    });
  }, [route.name]);

  return (
    <Container
      inert={!focused}
      style={{
        ...styles.container,
        backgroundColor: colors.background,
        ...style,
      }}
      // On Fabric we need to disable collapsing for the background to ensure
      // that we won't render unnecessary views due to the view flattening.
      // Container sets `collapsable` to `false` internally
      // This comment is left to make sure refactors don't remove it by mistake
    >
      {headerShown ? (
        <NavigationProvider navigation={navigation} route={route}>
          <View
            ref={headerRef}
            onLayout={(e) => {
              const { height } = e.nativeEvent.layout;

              setHeaderHeight(height);
            }}
            style={[styles.header, headerTransparent ? styles.absolute : null]}
          >
            {header}
          </View>
        </NavigationProvider>
      ) : null}
      <View style={styles.content}>
        <HeaderShownContext.Provider
          value={isParentHeaderShown || headerShown !== false}
        >
          <HeaderHeightContext.Provider
            value={headerShown ? headerHeight : (parentHeaderHeight ?? 0)}
          >
            {children}
          </HeaderHeightContext.Provider>
        </HeaderShownContext.Provider>
      </View>
    </Container>
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
    pointerEvents: 'box-none',
  },
  absolute: {
    position: 'absolute',
    top: 0,
    start: 0,
    end: 0,
  },
});
