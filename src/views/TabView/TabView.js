/* @flow */

import * as React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { TabViewAnimated, TabViewPagerPan } from 'react-native-tab-view';
import type { Layout } from 'react-native-tab-view/src/TabViewTypeDefinitions';
import SceneView from '../SceneView';
import withCachedChildNavigation from '../../withCachedChildNavigation';
import SafeAreaView from '../SafeAreaView';

import type {
  NavigationScreenProp,
  NavigationRoute,
  NavigationState,
  NavigationRouter,
  NavigationTabScreenOptions,
} from '../../TypeDefinition';

export type TabViewConfig = {
  tabBarComponent?: React.ComponentType<*>,
  tabBarPosition?: 'top' | 'bottom',
  tabBarOptions?: {},
  swipeEnabled?: boolean,
  animationEnabled?: boolean,
  configureTransition?: (
    currentTransitionProps: Object,
    nextTransitionProps: Object
  ) => Object,
  lazy?: boolean,
  initialLayout?: Layout,
};

export type TabScene = {
  route: NavigationRoute,
  focused: boolean,
  index: number,
  tintColor?: ?string,
};

type Props = {
  tabBarComponent?: React.ComponentType<*>,
  tabBarPosition?: 'top' | 'bottom',
  tabBarOptions?: {},
  swipeEnabled?: boolean,
  animationEnabled?: boolean,
  configureTransition?: (
    currentTransitionProps: Object,
    nextTransitionProps: Object
  ) => Object,
  lazy?: boolean,
  initialLayout: Layout,

  screenProps?: {},
  navigation: NavigationScreenProp<NavigationState>,
  router: NavigationRouter<NavigationState, NavigationTabScreenOptions>,
  childNavigationProps: {
    [key: string]: NavigationScreenProp<NavigationRoute>,
  },
};

class TabView extends React.PureComponent<Props> {
  static defaultProps = {
    // fix for https://github.com/react-native-community/react-native-tab-view/issues/312
    initialLayout: Platform.select({
      android: { width: 1, height: 0 },
    }),
  };

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

  _getOnPress = (previousScene: TabScene, { route }: TabScene) => {
    const options = this.props.router.getScreenOptions(
      this.props.childNavigationProps[route.key],
      this.props.screenProps || {}
    );

    return options.tabBarOnPress;
  };

  _getTestIDProps = ({ route }: TabScene) => {
    const options = this.props.router.getScreenOptions(
      this.props.childNavigationProps[route.key],
      this.props.screenProps || {}
    );

    return options.tabBarTestIDProps;
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
        screenProps={this.props.screenProps}
        navigation={this.props.navigation}
        getLabel={this._getLabel}
        getTestIDProps={this._getTestIDProps}
        getOnPress={this._getOnPress}
        renderIcon={this._renderIcon}
        animationEnabled={animationEnabled}
      />
    );
  };

  _renderPager = (props: *) => <TabViewPagerPan {...props} />;

  render() {
    const {
      router,
      tabBarComponent,
      tabBarPosition,
      animationEnabled,
      configureTransition,
      lazy,
      initialLayout,
      screenProps,
    } = this.props;

    let renderHeader;
    let renderFooter;
    let renderPager;

    const { state } = this.props.navigation;
    const options = router.getScreenOptions(
      this.props.childNavigationProps[state.routes[state.index].key],
      screenProps || {}
    );

    const tabBarVisible =
      options.tabBarVisible == null ? true : options.tabBarVisible;

    const swipeEnabled =
      options.swipeEnabled == null
        ? this.props.swipeEnabled
        : options.swipeEnabled;

    if (tabBarComponent !== undefined && tabBarVisible) {
      if (tabBarPosition === 'bottom') {
        renderFooter = this._renderTabBar;
      } else {
        renderHeader = this._renderTabBar;
      }
    }

    if (
      (animationEnabled === false && swipeEnabled === false) ||
      typeof configureTransition === 'function'
    ) {
      renderPager = this._renderPager;
    }

    const props = {
      lazy,
      initialLayout,
      animationEnabled,
      configureTransition,
      swipeEnabled,
      renderPager,
      renderHeader,
      renderFooter,
      renderScene: this._renderScene,
      onIndexChange: this._handlePageChanged,
      navigationState: this.props.navigation.state,
      screenProps: this.props.screenProps,
      style: styles.container,
    };

    // $FlowFixMe: mismatch with react-native-tab-view type
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
});
