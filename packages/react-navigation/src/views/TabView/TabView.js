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
} from '../../TypeDefinition';

export type TabViewConfig = {
  tabBarComponent?: ReactClass<*>;
  tabBarPosition?: 'top' | 'bottom';
  tabBarOptions?: {};
  swipeEnabled?: boolean;
  animationEnabled?: boolean;
  lazyLoad?: boolean;
};

export type TabScene = {
  route: NavigationRoute;
  focused: boolean;
  index: number;
  tintColor?: ?string;
};

type Props = TabViewConfig & {
  screenProps?: {},
  navigation: NavigationScreenProp<NavigationState, NavigationAction>;
  router: NavigationRouter,
  childNavigationProps: { [key: string]: NavigationScreenProp<NavigationRoute, NavigationAction> },
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

  _getLabel = ({ focused, route, tintColor }: TabScene) => {
    const tabBar = this.props.router.getScreenConfig(
      this.props.childNavigationProps[route.key],
      'tabBar'
    );

    if (tabBar && tabBar.label) {
      return typeof tabBar.label === 'function'
        ? tabBar.label({ tintColor, focused })
        : tabBar.label;
    }

    const title = this.props.router.getScreenConfig(
      this.props.childNavigationProps[route.key],
      'title'
    );
    if (typeof title === 'string') {
      return title;
    }

    return route.routeName;
  };

  _renderIcon = ({ focused, route, tintColor }: TabScene) => {
    const tabBar = this.props.router.getScreenConfig(
      this.props.childNavigationProps[route.key],
      'tabBar'
    );
    if (tabBar && tabBar.icon) {
      return typeof tabBar.icon === 'function'
        ? tabBar.icon({ tintColor, focused })
        : tabBar.icon;
    }
    return null;
  };

  _renderTabBar = (props: *) => {
    const {
      tabBarOptions,
      tabBarComponent: TabBarComponent,
      animationEnabled,
    } = this.props;
    if (typeof TabBarComponent === 'undefined') {
      return null;
    }
    return (
      <TabBarComponent
        {...props}
        {...tabBarOptions}
        navigation={this.props.navigation}
        getLabel={this._getLabel}
        renderIcon={this._renderIcon}
        animationEnabled={animationEnabled}
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

    const { state } = this.props.navigation;
    const tabBar = this.props.router.getScreenConfig(this.props.childNavigationProps[state.routes[state.index].key], 'tabBar');

    const tabBarVisible = tabBar ? tabBar.visible !== false : true;

    if (tabBarComponent !== undefined && tabBarVisible) {
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
      /* $FlowFixMe */
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

TabViewEnhanced.TabBarTop = TabBarTop;
TabViewEnhanced.TabBarBottom = TabBarBottom;

export default TabViewEnhanced;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
