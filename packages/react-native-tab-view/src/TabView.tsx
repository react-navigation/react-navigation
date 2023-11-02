import * as React from 'react';
import {
  I18nManager,
  type LayoutChangeEvent,
  Platform,
  type StyleProp,
  StyleSheet,
  View,
  type ViewStyle,
} from 'react-native';

import { Pager } from './Pager';
import { SceneView } from './SceneView';
import { TabBar } from './TabBar';
import type {
  Layout,
  LocaleDirection,
  NavigationState,
  PagerProps,
  Route,
  SceneRendererProps,
} from './types';

export type Props<T extends Route> = Omit<PagerProps, 'layoutDirection'> & {
  onIndexChange: (index: number) => void;
  navigationState: NavigationState<T>;
  renderScene: (props: SceneRendererProps & { route: T }) => React.ReactNode;
  renderLazyPlaceholder?: (props: { route: T }) => React.ReactNode;
  renderTabBar?: (
    props: SceneRendererProps & { navigationState: NavigationState<T> }
  ) => React.ReactNode;
  tabBarPosition?: 'top' | 'bottom';
  initialLayout?: Partial<Layout>;
  lazy?: ((props: { route: T }) => boolean) | boolean;
  lazyPreloadDistance?: number;
  sceneContainerStyle?: StyleProp<ViewStyle>;
  direction?: LocaleDirection;
  pagerStyle?: StyleProp<ViewStyle>;
  style?: StyleProp<ViewStyle>;
};

export function TabView<T extends Route>({
  onIndexChange,
  navigationState,
  renderScene,
  initialLayout,
  keyboardDismissMode = 'auto',
  lazy = false,
  lazyPreloadDistance = 0,
  onSwipeStart,
  onSwipeEnd,
  renderLazyPlaceholder = () => null,
  renderTabBar = (props) => <TabBar {...props} />,
  sceneContainerStyle,
  pagerStyle,
  style,
  direction = I18nManager.getConstants().isRTL ? 'rtl' : 'ltr',
  swipeEnabled = true,
  tabBarPosition = 'top',
  animationEnabled = true,
  overScrollMode,
}: Props<T>) {
  if (
    Platform.OS !== 'web' &&
    direction !== (I18nManager.getConstants().isRTL ? 'rtl' : 'ltr')
  ) {
    console.warn(
      `The 'direction' prop is set to '${direction}' but the effective value is '${
        I18nManager.getConstants().isRTL ? 'rtl' : 'ltr'
      }'. This is not supported. Please use I18nManager.forceRTL to change the layout direction.`
    );
  }

  const [layout, setLayout] = React.useState({
    width: 0,
    height: 0,
    ...initialLayout,
  });

  const jumpToIndex = (index: number) => {
    if (index !== navigationState.index) {
      onIndexChange(index);
    }
  };

  const handleLayout = (e: LayoutChangeEvent) => {
    const { height, width } = e.nativeEvent.layout;

    setLayout((prevLayout) => {
      if (prevLayout.width === width && prevLayout.height === height) {
        return prevLayout;
      }

      return { height, width };
    });
  };

  return (
    <View onLayout={handleLayout} style={[styles.pager, style]}>
      <Pager
        layout={layout}
        navigationState={navigationState}
        keyboardDismissMode={keyboardDismissMode}
        swipeEnabled={swipeEnabled}
        onSwipeStart={onSwipeStart}
        onSwipeEnd={onSwipeEnd}
        onIndexChange={jumpToIndex}
        animationEnabled={animationEnabled}
        overScrollMode={overScrollMode}
        style={pagerStyle}
        layoutDirection={direction}
      >
        {({ position, render, addEnterListener, jumpTo }) => {
          // All of the props here must not change between re-renders
          // This is crucial to optimizing the routes with PureComponent
          const sceneRendererProps = {
            position,
            layout,
            jumpTo,
          };

          return (
            <React.Fragment>
              {tabBarPosition === 'top' &&
                renderTabBar({
                  ...sceneRendererProps,
                  navigationState,
                })}
              {render(
                navigationState.routes.map((route, i) => {
                  return (
                    <SceneView
                      {...sceneRendererProps}
                      addEnterListener={addEnterListener}
                      key={route.key}
                      index={i}
                      lazy={typeof lazy === 'function' ? lazy({ route }) : lazy}
                      lazyPreloadDistance={lazyPreloadDistance}
                      navigationState={navigationState}
                      style={sceneContainerStyle}
                    >
                      {({ loading }) =>
                        loading
                          ? renderLazyPlaceholder({ route })
                          : renderScene({
                              ...sceneRendererProps,
                              route,
                            })
                      }
                    </SceneView>
                  );
                })
              )}
              {tabBarPosition === 'bottom' &&
                renderTabBar({
                  ...sceneRendererProps,
                  navigationState,
                })}
            </React.Fragment>
          );
        }}
      </Pager>
    </View>
  );
}

const styles = StyleSheet.create({
  pager: {
    flex: 1,
    overflow: 'hidden',
  },
});
