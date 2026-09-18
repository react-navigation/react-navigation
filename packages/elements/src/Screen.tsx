import {
  type NavigationProp,
  NavigationProvider,
  type ParamListBase,
  type RouteProp,
  useTheme,
} from '@react-navigation/native';
import * as React from 'react';
import { Platform, StyleSheet, View, type ViewProps } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Container, type Props as ContainerProps } from './Container';
import { getDefaultHeaderHeight } from './Header/getDefaultHeaderHeight';
import { HeaderHeightContext } from './Header/HeaderHeightContext';
import { HeaderShownContext } from './Header/HeaderShownContext';
import { useFrameSize } from './useFrameSize';

type Props = {
  focused: boolean;
  modal?: boolean | undefined;
  navigation: NavigationProp<ParamListBase>;
  route: RouteProp<ParamListBase>;
  header: React.ReactNode;
  headerShown?: boolean | undefined;
  headerStatusBarHeight?: number | undefined;
  headerTransparent?: boolean | undefined;
  pageOverflowEnabled?: boolean | undefined;
  contentStyle?: ViewProps['style'] | undefined;
  style?: ContainerProps['style'] | undefined;
  children: React.ReactNode;
};

export function Screen(props: Props) {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();

  const isParentHeaderShown = React.use(HeaderShownContext);
  const parentHeaderHeight = React.use(HeaderHeightContext);

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
    contentStyle,
    pageOverflowEnabled = false,
  } = props;

  const defaultHeaderHeight = useFrameSize((size) =>
    getDefaultHeaderHeight({
      landscape: size.width > size.height,
      modalPresentation: modal,
      topInset: headerStatusBarHeight,
    })
  );

  // If the container fills the body, we consider it to be a "page" that can overflow the screen
  // So we adjust the style accordingly to let the content take more space if needed
  // This lets the document.body handle scrolling of the content
  // This is necessary for mobile browsers to be able to hide the address bar on scroll
  const [fill, setFill] = React.useState(false);

  const onRef = React.useCallback(
    (node: HTMLDivElement | React.ComponentRef<typeof View> | null) => {
      if (
        Platform.OS !== 'web' ||
        !pageOverflowEnabled ||
        !(node instanceof HTMLElement)
      ) {
        return;
      }

      const updateFill = () => {
        setFill(
          node.clientWidth === document.body.clientWidth &&
            node.clientHeight === document.body.clientHeight
        );
      };

      updateFill();

      const observer = new ResizeObserver(updateFill);

      observer.observe(node);
      observer.observe(document.body);

      return () => observer.disconnect();
    },
    [pageOverflowEnabled]
  );

  const page = pageOverflowEnabled && focused && fill;

  const headerRef = React.useRef<React.ComponentRef<typeof View>>(null);

  const [headerHeight, setHeaderHeight] = React.useState(defaultHeaderHeight);

  React.useLayoutEffect(() => {
    headerRef.current?.measure((_x, _y, _width, height) => {
      setHeaderHeight(height);
    });
  }, [route.name]);

  return (
    <Container
      ref={onRef}
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
            style={[
              styles.header,
              headerTransparent
                ? [
                    styles.absolute,
                    // Specify an explicit min height for Android screen readers
                    { minHeight: headerHeight },
                  ]
                : null,
            ]}
          >
            <View
              ref={headerRef}
              onLayout={(e) => {
                const { height } = e.nativeEvent.layout;

                setHeaderHeight(height);
              }}
              style={{ pointerEvents: 'box-none' }}
            >
              {header}
            </View>
          </View>
        </NavigationProvider>
      ) : null}
      <View style={[page ? styles.page : styles.content, contentStyle]}>
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
  page: {
    flexGrow: 1,
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
