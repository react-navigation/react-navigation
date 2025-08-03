import * as React from 'react';
import {
  I18nManager,
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
  AdapterCommonProps,
  AdapterProps,
  Layout,
  LocaleDirection,
  NavigationState,
  Route,
  SceneRendererProps,
  TabDescriptor,
} from './types';

export type Props<T extends Route> = AdapterCommonProps & {
  onIndexChange: (index: number) => void;
  onTabSelect?: (props: { index: number }) => void;
  navigationState: NavigationState<T>;
  renderLazyPlaceholder?: (props: { route: T }) => React.ReactNode;
  renderTabBar?: (
    props: SceneRendererProps & {
      navigationState: NavigationState<T>;
      options: Record<string, TabDescriptor<T>> | undefined;
    }
  ) => React.ReactNode;
  renderAdapter?: (props: AdapterProps) => React.ReactElement;
  tabBarPosition?: 'top' | 'bottom';
  initialLayout?: Partial<Layout>;
  lazy?: ((props: { route: T }) => boolean) | boolean;
  lazyPreloadDistance?: number;
  direction?: LocaleDirection;
  pagerStyle?: StyleProp<ViewStyle>;
  style?: StyleProp<ViewStyle>;
  renderScene: (props: SceneRendererProps & { route: T }) => React.ReactNode;
  options?: Record<string, TabDescriptor<T>>;
  commonOptions?: TabDescriptor<T>;
};

const renderLazyPlaceholderDefault = () => null;

export function TabView<T extends Route>({
  onIndexChange,
  onTabSelect,
  navigationState,
  renderScene,
  initialLayout,
  keyboardDismissMode = 'auto',
  lazy = false,
  lazyPreloadDistance = 0,
  onSwipeStart,
  onSwipeEnd,
  renderLazyPlaceholder = renderLazyPlaceholderDefault,
  // eslint-disable-next-line @eslint-react/no-unstable-default-props
  renderTabBar = (props) => <TabBar {...props} />,
  // eslint-disable-next-line @eslint-react/no-unstable-default-props
  renderAdapter = (props) => <Pager {...props} />,
  pagerStyle,
  style,
  direction = I18nManager.getConstants().isRTL ? 'rtl' : 'ltr',
  swipeEnabled = true,
  tabBarPosition = 'top',
  animationEnabled = true,
  options: sceneOptions,
  commonOptions,
}: Props<T>) {
  if (
    Platform.OS !== 'web' &&
    direction !== (I18nManager.getConstants().isRTL ? 'rtl' : 'ltr')
  ) {
    console.warn(
      `The 'direction' prop is set to '${direction}' but the effective value is '${
        I18nManager.getConstants().isRTL ? 'rtl' : 'ltr'
      }'. This is not supported. Make sure to match the 'direction' prop with the writing direction of the app.`
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

  const onMeasure = ({ height, width }: { height: number; width: number }) => {
    setLayout((prevLayout) => {
      if (prevLayout.width === width && prevLayout.height === height) {
        return prevLayout;
      }
      return { height, width };
    });
  };

  const options = Object.fromEntries(
    navigationState.routes.map((route) => [
      route.key,
      {
        ...commonOptions,
        ...sceneOptions?.[route.key],
      },
    ])
  );

  const ref = React.useRef<View>(null);

  React.useLayoutEffect(() => {
    ref.current?.measure((_x, _y, width, height) => {
      onMeasure({ width, height });
    });
  });

  const element = renderAdapter({
    layout,
    navigationState,
    keyboardDismissMode,
    swipeEnabled,
    onSwipeStart,
    onSwipeEnd,
    onIndexChange: jumpToIndex,
    onTabSelect,
    animationEnabled,
    layoutDirection: direction,
    style: pagerStyle,
    children: ({ position, render, subscribe, jumpTo }) => {
      // All the props here must not change between re-renders
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
              options,
              navigationState,
            })}
          {render(
            navigationState.routes.map((route, i) => {
              const { sceneStyle } = options?.[route.key] ?? {};

              return (
                <SceneView
                  key={route.key}
                  {...sceneRendererProps}
                  subscribe={subscribe}
                  index={i}
                  lazy={typeof lazy === 'function' ? lazy({ route }) : lazy}
                  lazyPreloadDistance={lazyPreloadDistance}
                  navigationState={navigationState}
                  style={sceneStyle}
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
              options,
              navigationState,
            })}
        </React.Fragment>
      );
    },
  });

  return (
    <View
      ref={ref}
      onLayout={(e) => onMeasure(e.nativeEvent.layout)}
      style={[styles.pager, style]}
    >
      {element}
    </View>
  );
}

const styles = StyleSheet.create({
  pager: {
    flex: 1,
    overflow: 'hidden',
  },
});
