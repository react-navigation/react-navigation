/* @flow */

import React, { PureComponent } from 'react';
import {
  Platform,
  StyleSheet,
} from 'react-native';
import {
  TabViewAnimated,
  TabViewPagerAndroid,
  TabViewPagerScroll,
  TabViewPagerPan,
} from 'react-native-tab-view';
import TabBarTop from './TabBarTop';
import TabBarBottom from './TabBarBottom';
import SceneView from '../SceneView';
import withCachedChildNavigation from '../../withCachedChildNavigation';

import type {
  NavigationScreenProp,
  NavigationRoute,
  NavigationAction,
  NavigationState,
  NavigationRouter,
  TabBarConfig,
} from '../../TypeDefinition';

export type TabViewConfig = {
  tabBarComponent?: ReactClass<*>;
  tabBarPosition?: 'top' | 'bottom';
  tabBarOptions?: {};
  swipeEnabled?: boolean;
  animationEnabled?: boolean;
  lazyLoad?: boolean;
};

type Props = TabViewConfig & {
  screenProps?: {},
  navigation: NavigationScreenProp<NavigationState, NavigationAction>;
  router: NavigationRouter,
  childNavigationProps: { [key: string]: NavigationScreenProp<NavigationRoute, NavigationAction> },
};

type TabScene = {
  route: NavigationRoute;
  focused: boolean;
  index: number;
  tintColor?: string;
};

type TabBarConfigs = {
  [key: string]: {
    focused: ?TabBarConfig,
    unfocused: ?TabBarConfig,
  }
};

let TabViewPager;

switch (Platform.OS) {
  case 'android':
    TabViewPager = TabViewPagerAndroid;
    break;
  case 'ios':
    TabViewPager = TabViewPagerScroll;
    break;
  default:
    TabViewPager = TabViewPagerPan;
}

class TabView extends PureComponent<void, Props, void> {

  static TabBarTop = TabBarTop;
  static TabBarBottom = TabBarBottom;

  props: Props;

  _handlePageChanged = (index: number) => {
    const { navigation } = this.props;
    navigation.navigate(
      navigation.state.routes[index].routeName);
  };

  _renderScene = ({ route }: any) => {
    const TabComponent = this.props.router.getComponentForRouteName(route.routeName);
    return (
      <SceneView
        screenProps={this.props.screenProps}
        component={TabComponent}
        navigation={this.props.childNavigationProps[route.key]}
      />
    );
  };

  _getLabelText = (configs: TabBarConfigs) => ({ route }: TabScene) => {
    const tabBar = configs[route.key].focused;
    if (tabBar && typeof tabBar.label === 'string') {
      return tabBar.label;
    }
    const title = this.props.router.getScreenConfig(this.props.childNavigationProps[route.key], 'title');
    if (typeof title === 'string') {
      return title;
    }
    return route.routeName;
  };

  _renderIcon = (configs: TabBarConfigs) => ({ focused, route }: TabScene) => {
    const tabBar = focused ? configs[route.key].focused : configs[route.key].unfocused;
    return tabBar && tabBar.icon ? tabBar.icon : null;
  };

  _renderTabBar = (props: *) => {
    const {
      tabBarOptions,
      tabBarComponent: TabBarComponent,
      animationEnabled,
      childNavigationProps,
      router,
    } = this.props;

    if (TabBarComponent == null) {
      return null;
    }

    const defaultTabBarProps = TabBarComponent.defaultProps || {};
    const activeTintColor =
      tabBarOptions && tabBarOptions.activeTintColor ?
      tabBarOptions.activeTintColor :
      defaultTabBarProps.activeTintColor;
    const inactiveTintColor =
      tabBarOptions && tabBarOptions.inactiveTintColor ?
      tabBarOptions.inactiveTintColor :
      defaultTabBarProps.inactiveTintColor;

    const configs = props.navigationState.routes.reduce((acc: TabBarConfigs, route: *) => {
      const focusedOptions = { focused: true, tintColor: activeTintColor };
      const unfocusedOptions = { focused: false, tintColor: inactiveTintColor };
      const focusedConfig = router.getScreenConfig(childNavigationProps[route.key], 'tabBar', focusedOptions);
      const unfocusedConfig = router.getScreenConfig(childNavigationProps[route.key], 'tabBar', unfocusedOptions);
      return {
        ...acc,
        [route.key]: {
          focused: focusedConfig,
          unfocused: unfocusedConfig,
        },
      };
    }, {});

    return (
      <TabBarComponent
        {...props}
        {...tabBarOptions}
        getLabelText={this._getLabelText(configs)}
        renderIcon={this._renderIcon(configs)}
        animationEnabled={animationEnabled}
        router={this.props.router}
        navigation={this.props.navigation}
      />
    );
  };

  _renderPager = (props: *) => {
    const {
      swipeEnabled,
      animationEnabled,
    } = this.props;

    return (
      <TabViewPager
        {...props}
        swipeEnabled={swipeEnabled}
        animationEnabled={animationEnabled}
      />
    );
  };

  _configureTransition = () => null;

  render() {
    const {
      navigation,
      tabBarComponent,
      tabBarPosition,
      animationEnabled,
      lazyLoad,
    } = this.props;

    let renderHeader;
    let renderFooter;

    if (typeof tabBarComponent !== 'undefined') {
      if (tabBarPosition === 'bottom') {
        renderFooter = this._renderTabBar;
      } else {
        renderHeader = this._renderTabBar;
      }
    }

    let configureTransition;

    if (animationEnabled === false) {
      configureTransition = this._configureTransition;
    }

    return (
      <TabViewAnimated
        style={styles.container}
        navigationState={navigation.state}
        lazy={lazyLoad}
        renderHeader={renderHeader}
        renderFooter={renderFooter}
        renderScene={this._renderScene}
        renderPager={this._renderPager}
        configureTransition={configureTransition}
        onRequestChangeTab={this._handlePageChanged}
      />
    );
  }
}

const TabViewEnhanced = withCachedChildNavigation(TabView);

/* $FlowFixMe */
TabViewEnhanced.TabBarTop = TabBarTop;
TabViewEnhanced.TabBarBottom = TabBarBottom;

export default TabViewEnhanced;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
