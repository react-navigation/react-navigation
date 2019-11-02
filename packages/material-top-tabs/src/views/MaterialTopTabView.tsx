import * as React from 'react';
import { TabView, SceneRendererProps } from 'react-native-tab-view';
import { Route } from '@react-navigation/core';
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

  private getLabelText = ({ route }: { route: Route<string> }) => {
    const { descriptors } = this.props;
    const { options } = descriptors[route.key];

    return options.tabBarLabel !== undefined
      ? options.tabBarLabel
      : typeof options.title === 'string'
      ? options.title
      : route.name;
  };

  private getAccessibilityLabel = ({ route }: { route: Route<string> }) => {
    const { descriptors, state } = this.props;
    const { options } = descriptors[route.key];

    if (typeof options.tabBarAccessibilityLabel !== 'undefined') {
      return options.tabBarAccessibilityLabel;
    }

    const label = this.getLabelText({ route });

    if (typeof label === 'string') {
      return `${label}, tab, ${state.routes.indexOf(route) + 1} of ${
        state.routes.length
      }`;
    }

    return undefined;
  };

  private getTestID = ({ route }: { route: Route<string> }) => {
    return this.props.descriptors[route.key].options.tabBarTestID;
  };

  private handleTabPress = ({
    route,
    preventDefault,
  }: {
    route: Route<string>;
    preventDefault: () => void;
  }) => {
    const event = this.props.navigation.emit({
      type: 'tabPress',
      target: route.key,
    });

    if (event.defaultPrevented) {
      preventDefault();
    }
  };

  private handleTabLongPress = ({ route }: { route: Route<string> }) => {
    this.props.navigation.emit({
      type: 'tabLongPress',
      target: route.key,
    });
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
      tabBarPosition,
      tabBarOptions,
    } = this.props;

    if (tabBarVisible === false) {
      return null;
    }

    return tabBar({
      ...tabBarOptions,
      ...props,
      tabBarPosition: tabBarPosition,
      state: state,
      navigation: navigation,
      descriptors: descriptors,
      getAccessibilityLabel: this.getAccessibilityLabel,
      getLabelText: this.getLabelText,
      getTestID: this.getTestID,
      onTabPress: this.handleTabPress,
      onTabLongPress: this.handleTabLongPress,
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
        renderScene={({ route }) => descriptors[route.key].render()}
        navigationState={state}
        renderTabBar={this.renderTabBar}
        renderLazyPlaceholder={this.renderLazyPlaceholder}
        onSwipeStart={this.handleSwipeStart}
        onSwipeEnd={this.handleSwipeEnd}
      />
    );
  }
}
