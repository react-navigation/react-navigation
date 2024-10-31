import {
  CommonActions,
  type ParamListBase,
  type Route,
  type TabNavigationState,
  useLocale,
  useTheme,
} from '@react-navigation/native';
import { TabView } from 'react-native-tab-view';

import type {
  MaterialTopTabBarProps,
  MaterialTopTabDescriptorMap,
  MaterialTopTabNavigationConfig,
  MaterialTopTabNavigationHelpers,
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
    <TabView<Route<string>>
      {...rest}
      onIndexChange={(index) => {
        const route = state.routes[index];

        navigation.dispatch({
          ...CommonActions.navigate(route),
          target: state.key,
        });
      }}
      renderScene={({ route, position }) => (
        <TabAnimationContext.Provider value={{ position }}>
          {descriptors[route.key].render()}
        </TabAnimationContext.Provider>
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
                { backgroundColor: colors.background },
                options?.sceneStyle,
              ],
            },
          ];
        })
      )}
    />
  );
}
