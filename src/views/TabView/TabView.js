/* @flow */

import React, { PureComponent } from 'react';
import { View, StyleSheet } from 'react-native';
import { TabViewAnimated, TabViewPagerPan } from 'react-native-tab-view';
import SceneView from '../SceneView';
import withCachedChildNavigation from '../../withCachedChildNavigation';

import type {
  NavigationScreenProp,
  NavigationRoute,
  NavigationAction,
  NavigationState,
  NavigationRouter,
  NavigationTabScreenOptions,
  Style,
} from '../../TypeDefinition';

export type TabViewConfig = {
  tabBarComponent?: ReactClass<*>,
  tabBarPosition?: 'top' | 'bottom',
  tabBarOptions?: {
    style?: Style,
  },
  swipeEnabled?: boolean,
  animationEnabled?: boolean,
  lazy?: boolean,
};

export type TabScene = {
  route: NavigationRoute,
  focused: boolean,
  index: number,
  tintColor?: ?string,
};

type Props = {
  tabBarComponent?: ReactClass<*>,
  tabBarPosition?: 'top' | 'bottom',
  tabBarOptions?: {
    style?: Style,
  },
  swipeEnabled?: boolean,
  animationEnabled?: boolean,
  lazy?: boolean,

  screenProps?: {},
  navigation: NavigationScreenProp<NavigationState, NavigationAction>,
  router: NavigationRouter<
    NavigationState,
    NavigationAction,
    NavigationTabScreenOptions
  >,
  childNavigationProps: {
    [key: string]: NavigationScreenProp<NavigationRoute, NavigationAction>,
  },
};

class TabView extends PureComponent<void, Props, void> {
  props: Props;

  _handlePageChanged = (index: number) => {
    const { navigation } = this.props;
    navigation.navigate(navigation.state.routes[index].routeName);
  };

  _renderScene = ({ route }: any) => {
    const { screenProps } = this.props;
    const childNavigation = this.props.childNavigationProps[route.key];
    const TabComponent = this.props.router.getComponentForRouteName(
      route.routeName
    );
    return (
      <View style={styles.page}>
        <SceneView
          screenProps={screenProps}
          component={TabComponent}
          navigation={childNavigation}
        />
      </View>
    );
  };

  _getLabel = ({ route, tintColor, focused }: TabScene) => {
    const options = this.props.router.getScreenOptions(
      this.props.childNavigationProps[route.key],
      this.props.screenProps || {}
    );

    if (options.tabBarLabel) {
      return typeof options.tabBarLabel === 'function'
        ? options.tabBarLabel({ tintColor, focused })
        : options.tabBarLabel;
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
      animationEnabled,
      navigation,
      router,
      screenProps,
      tabBarComponent: TabBarComponent,
      tabBarOptions,
    } = this.props;
    if (typeof TabBarComponent === 'undefined') {
      return null;
    }

    const { state } = navigation;
    const options = router.getScreenOptions(
      this.props.childNavigationProps[state.routes[state.index].key],
      screenProps || {}
    );

    const tabBarVisible =
      options.tabBarVisible === null || options.tabBarVisible === undefined
        ? true
        : options.tabBarVisible;

    return (
      <TabBarComponent
        {...props}
        {...tabBarOptions}
        navigation={this.props.navigation}
        getLabel={this._getLabel}
        renderIcon={this._renderIcon}
        animationEnabled={animationEnabled}
        style={[tabBarVisible ? undefined : styles.hidden, tabBarOptions && tabBarOptions.style]}
      />
    );
  };

  _renderPager = (props: *) => <TabViewPagerPan {...props} />;

  render() {
    const {
      tabBarComponent,
      tabBarPosition,
      animationEnabled,
      swipeEnabled,
      lazy,
    } = this.props;

    let renderHeader;
    let renderFooter;
    let renderPager;

    if (tabBarComponent !== undefined) {
      if (tabBarPosition === 'bottom') {
        renderFooter = this._renderTabBar;
      } else {
        renderHeader = this._renderTabBar;
      }
    }

    if (animationEnabled === false && swipeEnabled === false) {
      renderPager = this._renderPager;
    }

    const props = {
      lazy,
      animationEnabled,
      swipeEnabled,
      renderPager,
      renderHeader,
      renderFooter,
      renderScene: this._renderScene,
      onRequestChangeTab: this._handlePageChanged,
      navigationState: this.props.navigation.state,
      screenProps: this.props.screenProps,
      style: styles.container,
    };

    return <TabViewAnimated {...props} />;
  }
}

export default withCachedChildNavigation(TabView);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  page: {
    flex: 1,
    overflow: 'hidden',
  },

  hidden: {
    height: 0,
    opacity: 0,
  },
});
