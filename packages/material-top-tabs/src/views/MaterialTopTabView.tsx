import { ActivityView } from '@react-navigation/elements/internal';
import {
  CommonActions,
  type ParamListBase,
  type Route,
  type TabNavigationState,
  useLocale,
  useTheme,
} from '@react-navigation/native';
import { useMemo, useState } from 'react';
import { type Animated, StyleSheet } from 'react-native';
import { TabView } from 'react-native-tab-view';

import type {
  MaterialTopTabBarProps,
  MaterialTopTabDescriptorMap,
  MaterialTopTabNavigationConfig,
  MaterialTopTabNavigationHelpers,
  MaterialTopTabNavigationOptions,
} from '../types';
import { TabAnimationContext } from '../utils/TabAnimationContext';
import { MaterialTopTabBar } from './MaterialTopTabBar';

type Props = MaterialTopTabNavigationConfig & {
  state: TabNavigationState<ParamListBase>;
  navigation: MaterialTopTabNavigationHelpers;
  descriptors: MaterialTopTabDescriptorMap;
};

const renderTabBarDefault = (props: MaterialTopTabBarProps) => (
  <MaterialTopTabBar {...props} />
);

export function MaterialTopTabView({
  tabBar = renderTabBarDefault,
  state,
  navigation,
  descriptors,
  ...rest
}: Props) {
  const { colors } = useTheme();
  const { direction } = useLocale();

  const renderTabBar: React.ComponentProps<
    typeof TabView<Route<string>>
  >['renderTabBar'] = ({
    /* eslint-disable @typescript-eslint/no-unused-vars */
    navigationState,
    options,
    /* eslint-enable @typescript-eslint/no-unused-vars */
    ...rest
  }) => {
    return tabBar({
      ...rest,
      state: state,
      navigation: navigation,
      descriptors: descriptors,
    });
  };

  const focusedOptions = descriptors[state.routes[state.index].key].options;

  return (
    <TabView
      {...rest}
      onIndexChange={(index) => {
        const route = state.routes[index];

        navigation.dispatch({
          ...CommonActions.navigate(route),
          target: state.key,
        });
      }}
      renderScene={({ route, position }) => (
        <SceneContent
          focused={route.key === state.routes[state.index].key}
          preloaded={state.preloadedRouteKeys.includes(route.key)}
          position={position}
          options={descriptors[route.key].options}
        >
          {descriptors[route.key].render()}
        </SceneContent>
      )}
      navigationState={state}
      renderTabBar={renderTabBar}
      renderLazyPlaceholder={({ route }) =>
        descriptors[route.key].options.lazyPlaceholder?.() ?? null
      }
      lazy={({ route }) =>
        descriptors[route.key].options.lazy === true &&
        !state.preloadedRouteKeys.includes(route.key)
      }
      lazyPreloadDistance={focusedOptions.lazyPreloadDistance}
      swipeEnabled={focusedOptions.swipeEnabled}
      animationEnabled={focusedOptions.animationEnabled}
      onSwipeStart={() => navigation.emit({ type: 'swipeStart' })}
      onSwipeEnd={() => navigation.emit({ type: 'swipeEnd' })}
      direction={direction}
      options={Object.fromEntries(
        state.routes.map((route) => {
          const options = descriptors[route.key]?.options;

          return [
            route.key,
            {
              sceneStyle: [
                { backgroundColor: colors?.background },
                options?.sceneStyle,
              ],
            },
          ];
        })
      )}
    />
  );
}

function SceneContent({
  focused,
  preloaded,
  position,
  options,
  children,
}: {
  focused: boolean;
  preloaded: boolean;
  position: Animated.AnimatedInterpolation<number>;
  options: MaterialTopTabNavigationOptions;
  children: React.ReactNode;
}) {
  const { inactiveBehavior = 'pause', lazy } = options;

  const [loaded, setLoaded] = useState(focused);

  if (focused && !loaded) {
    setLoaded(true);
  }

  const animationContext = useMemo(() => ({ position }), [position]);

  // For preloaded screens and if lazy is false,
  // Keep them active so that the effects can run
  const isActive =
    inactiveBehavior === 'none' ||
    focused ||
    preloaded ||
    (lazy === false && !loaded);

  return (
    <TabAnimationContext.Provider value={animationContext}>
      <ActivityView
        mode={isActive ? 'normal' : 'paused'}
        visible={
          // Tabs can be swiped quickly
          // So we keep all tabs visible to avoid flash of blank screen
          true
        }
        style={styles.scene}
      >
        {children}
      </ActivityView>
    </TabAnimationContext.Provider>
  );
}

const styles = StyleSheet.create({
  scene: {
    flex: 1,
  },
});
