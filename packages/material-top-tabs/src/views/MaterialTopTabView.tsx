import * as React from 'react';
import { View } from 'react-native';
import { TabView, SceneRendererProps } from 'react-native-tab-view';
import { Route, useTheme } from '@react-navigation/native';
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
  tabBarPosition: 'top' | 'bottom';
};

function SceneContent({ children }: { children: React.ReactNode }) {
  const { colors } = useTheme();

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {children}
    </View>
  );
}

export default class MaterialTopTabView extends React.PureComponent<Props> {
  static defaultProps = {
    tabBarPosition: 'top',
  };

  private renderLazyPlaceholder = (props: { route: Route<string> }) => {
    const { lazyPlaceholder } = this.props;

    if (lazyPlaceholder != null) {
      return lazyPlaceholder(props);
    }

    return null;
  };

  private renderTabBar = (props: SceneRendererProps) => {
    const { state, descriptors } = this.props;
    const route = state.routes[state.index];
    const options = descriptors[route.key].options;

    const tabBarVisible = options.tabBarVisible !== false;

    const {
      navigation,
      tabBar = (props: MaterialTopTabBarProps) => (
        <MaterialTopTabBar {...props} />
      ),
      tabBarOptions,
    } = this.props;

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

  private handleSwipeStart = () =>
    this.props.navigation.emit({
      type: 'swipeStart',
    });

  private handleSwipeEnd = () =>
    this.props.navigation.emit({
      type: 'swipeEnd',
    });

  render() {
    const {
      /* eslint-disable @typescript-eslint/no-unused-vars */
      lazyPlaceholder,
      tabBar,
      tabBarOptions,
      /* eslint-enable @typescript-eslint/no-unused-vars */
      state,
      navigation,
      descriptors,
      ...rest
    } = this.props;

    return (
      <TabView
        {...rest}
        onIndexChange={index =>
          navigation.dispatch({
            ...TabActions.jumpTo(state.routes[index].name),
            target: state.key,
          })
        }
        renderScene={({ route }) => (
          <SceneContent>{descriptors[route.key].render()}</SceneContent>
        )}
        navigationState={state}
        renderTabBar={this.renderTabBar}
        renderLazyPlaceholder={this.renderLazyPlaceholder}
        onSwipeStart={this.handleSwipeStart}
        onSwipeEnd={this.handleSwipeEnd}
      />
    );
  }
}
