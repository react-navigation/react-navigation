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
  NavigationTabScreenOptions,
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

type Props = {
  tabBarComponent?: ReactClass<*>;
  tabBarPosition?: 'top' | 'bottom';
  tabBarOptions?: {};
  swipeEnabled?: boolean;
  animationEnabled?: boolean;
  lazyLoad?: boolean;

  screenProps?: {},
  navigation: NavigationScreenProp<NavigationState, NavigationAction>;
  router: NavigationRouter<NavigationState, NavigationAction, NavigationTabScreenOptions>,
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
    const { screenProps } = this.props;
    const childNavigation = this.props.childNavigationProps[route.key];
    const TabComponent = this.props.router.getComponentForRouteName(route.routeName);
    return (
      <SceneView
        screenProps={screenProps}
        component={TabComponent}
        navigation={childNavigation}
        navigationOptions={this.props.router.getScreenOptions(childNavigation, screenProps)}
      />
    );
  };

  _getLabel = ({ focused, route, tintColor }: TabScene) => {
    const options = this.props.router.getScreenOptions(
      this.props.childNavigationProps[route.key],
      this.props.screenProps || {}
    );

    if (options.tabBarLabel) {
      return options.tabBarLabel;
    }

    if (typeof options.title === 'string') {
      return options.title;
    }

    return route.routeName;
  };

  _renderIcon = ({ focused, route, tintColor }: TabScene) => {
    const options = this.props.router.getScreenOptions(
      this.props.childNavigationProps[route.key],
      this.props.screenProps || {}
    );
    if (options.tabBarIcon) {
      return typeof options.tabBarIcon === 'function'
        ? options.tabBarIcon({ tintColor, focused })
        : options.tabBarIcon;
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
      router,
      navigation,
      tabBarComponent,
      tabBarPosition,
      animationEnabled,
      lazyLoad,
      screenProps,
    } = this.props;

    let renderHeader;
    let renderFooter;

    const { state } = this.props.navigation;
    const options = router.getScreenOptions(
      this.props.childNavigationProps[state.routes[state.index].key],
      screenProps || {}
    );

    const tabBarVisible = options.tabBarVisible == null ? true : options.tabBarVisible;

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
        navigationState={this.props.navigation.state}
        lazy={lazyLoad}
        renderHeader={renderHeader}
        renderFooter={renderFooter}
        renderScene={this._renderScene}
        renderPager={this._renderPager}
        configureTransition={configureTransition}
        onRequestChangeTab={this._handlePageChanged}
        screenProps={this.props.screenProps}
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
