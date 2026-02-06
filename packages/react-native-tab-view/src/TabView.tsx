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
  EventEmitterProps,
  LocaleDirection,
  NavigationState,
  Route,
  SceneRendererProps,
  TabDescriptor,
} from './types';

export type Props<T extends Route> = AdapterCommonProps & {
  /**
   * Callback which is called when the index of the active tab changes.
   * Must update the `navigationState.index` prop to the new index.
   *
   * Example:
   * ```js
   * onIndexChange={(index) => setState({ ...state, index })}
   * ```
   */
  onIndexChange: (index: number) => void;
  /**
   * Callback which is called when the tab navigation animation ends.
   * Useful for side effects that should run after the tab change animation.
   *
   * Unlike `onIndexChange`, this is called regardless of whether the index changed or not.
   */
  onTabSelect?: (props: { index: number }) => void;
  /**
   * State for the tab view containing the current index and routes.
   *
   * Example:
   * ```js
   * {
   *   index: 0,
   *   routes: [
   *     { key: 'first' },
   *     { key: 'second' },
   *   ],
   * }
   * ```
   */
  navigationState: NavigationState<T>;
  /**
   * Callback which returns a custom placeholder element.
   * The placeholder is shown when a scene is not yet loaded when `lazy` is enabled.
   */
  renderLazyPlaceholder?: (props: { route: T }) => React.ReactNode;
  /**
   * Callback which returns a custom tab bar element to display.
   */
  renderTabBar?: (
    props: SceneRendererProps &
      EventEmitterProps & {
        navigationState: NavigationState<T>;
        options: Record<string, TabDescriptor<T>> | undefined;
      }
  ) => React.ReactNode;
  /**
   * Callback which returns a custom adapter to use for the tab view.
   * Adapters are responsible for handling gestures and animations between tabs.
   *
   * The following adapters are provided out of the box:
   * - `PagerViewAdapter`: Uses `react-native-pager-view` for native experience.
   * - `PanResponderAdapter`: Uses `PanResponder` for a JS-based implementation.
   * - `ScrollViewAdapter`: Uses `ScrollView` for an implementation based on `ScrollView`.
   *
   * Defaults to `PagerViewAdapter` on Android and iOS, and `PanResponderAdapter` on other platforms.
   */
  renderAdapter?: (props: AdapterProps) => React.ReactElement;
  /**
   * Position of the tab bar in the tab view.
   * Defaults to `'top'`.
   */
  tabBarPosition?: 'top' | 'bottom';
  /**
   * Whether to lazily render the scenes.
   * When enabled, scenes are rendered only when they come into view.
   *
   * Can be a boolean or a function that receives the route and returns a boolean.
   * Defaults to `false`.
   */
  lazy?: ((props: { route: T }) => boolean) | boolean;
  /**
   * How many screens to preload when `lazy` is enabled.
   *
   * Defaults to `0`.
   */
  lazyPreloadDistance?: number;
  /**
   * The layout direction of the tab view.
   *
   * Defaults to the app's locale direction (RTL or LTR).
   */
  direction?: LocaleDirection;
  /**
   * Style to apply to the pager container.
   */
  pagerStyle?: StyleProp<ViewStyle>;
  /**
   * Style to apply to the tab view container.
   */
  style?: StyleProp<ViewStyle>;
  /**
   * Callback which returns a React element to render for each route.
   */
  renderScene: (props: SceneRendererProps & { route: T }) => React.ReactNode;
  /**
   * Options for individual tabs, keyed by route key.
   *
   * Example:
   * ```js
   * {
   *  first: { labelText: 'First Tab' },
   *  second: { labelText: 'Second Tab' },
   * }
   *
   * These options are merged with `commonOptions`.
   */
  options?: Record<string, TabDescriptor<T>>;
  /**
   * Options that apply to all tabs.
   *
   * Individual tab options from `options` will override these.
   */
  commonOptions?: TabDescriptor<T>;
};

const renderLazyPlaceholderDefault = () => null;

export function TabView<T extends Route>({
  onIndexChange,
  onTabSelect,
  navigationState,
  renderScene,
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

  const jumpToIndex = (index: number) => {
    if (index !== navigationState.index) {
      onIndexChange(index);
    }
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

  const element = renderAdapter({
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
        jumpTo,
      };

      return (
        <React.Fragment>
          {tabBarPosition === 'top' &&
            renderTabBar({
              ...sceneRendererProps,
              subscribe,
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
              subscribe,
              options,
              navigationState,
            })}
        </React.Fragment>
      );
    },
  });

  return <View style={[styles.container, style]}>{element}</View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
  },
});
