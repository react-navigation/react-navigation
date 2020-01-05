import * as React from 'react';
import { TabView, SceneRendererProps } from 'react-native-tab-view';
import { useTheme } from '@react-navigation/native';
import { TabNavigationState, TabActions } from '@react-navigation/routers';

import MaterialTopTabBar from './MaterialTopTabBar';
import {
  MaterialTopTabDescriptorMap,
  MaterialTopTabNavigationConfig,
  MaterialTopTabNavigationHelpers,
  MaterialTopTabBarProps,
} from '../types';

type Props = MaterialTopTabNavigationConfig & {
  state: TabNavigationState;
  navigation: MaterialTopTabNavigationHelpers;
  descriptors: MaterialTopTabDescriptorMap;
  tabBarPosition?: 'top' | 'bottom';
};

export default function MaterialTopTabView({
  pager,
  lazyPlaceholder,
  tabBar = (props: MaterialTopTabBarProps) => <MaterialTopTabBar {...props} />,
  tabBarOptions,
  state,
  navigation,
  descriptors,
  sceneContainerStyle,
  ...rest
}: Props) {
  const { colors } = useTheme();

  const renderTabBar = (props: SceneRendererProps) => {
    const route = state.routes[state.index];
    const options = descriptors[route.key].options;

    const tabBarVisible = options.tabBarVisible !== false;

    if (tabBarVisible === false) {
      return null;
    }

    return tabBar({
      ...tabBarOptions,
      ...props,
      state: state,
      navigation: navigation,
      descriptors: descriptors,
    });
  };

  return (
    <TabView
      {...rest}
      onIndexChange={index =>
        navigation.dispatch({
          ...TabActions.jumpTo(state.routes[index].name),
          target: state.key,
        })
      }
      renderScene={({ route }) => descriptors[route.key].render()}
      navigationState={state}
      renderTabBar={renderTabBar}
      renderPager={pager}
      renderLazyPlaceholder={lazyPlaceholder}
      onSwipeStart={() => navigation.emit({ type: 'swipeStart' })}
      onSwipeEnd={() => navigation.emit({ type: 'swipeEnd' })}
      sceneContainerStyle={[
        { backgroundColor: colors.background },
        sceneContainerStyle,
      ]}
    />
  );
}
