import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { TabViewAnimated, TabViewPagerPan } from 'react-native-tab-view';
import SafeAreaView from 'react-native-safe-area-view';

import ResourceSavingSceneView from '../ResourceSavingSceneView';
import withCachedChildNavigation from '../../withCachedChildNavigation';

class TabView extends React.PureComponent {
  static defaultProps = {
    lazy: true,
    removedClippedSubviews: true,
    // fix for https://github.com/react-native-community/react-native-tab-view/issues/312
    initialLayout: Platform.select({
      android: { width: 1, height: 0 },
    }),
  };

  _handlePageChanged = index => {
    const { navigation } = this.props;
    navigation.navigate(navigation.state.routes[index].routeName);
  };

  _renderScene = ({ route }) => {
    const { screenProps, navigation } = this.props;
    const focusedIndex = navigation.state.index;
    const focusedKey = navigation.state.routes[focusedIndex].key;
    const key = route.key;
    const childNavigation = this.props.childNavigationProps[route.key];
    const TabComponent = this.props.router.getComponentForRouteName(
      route.routeName
    );

    return (
      <ResourceSavingSceneView
        lazy={this.props.lazy}
        isFocused={focusedKey === key}
        removeClippedSubViews={this.props.removeClippedSubviews}
        animationEnabled={this.props.animationEnabled}
        swipeEnabled={this.props.swipeEnabled}
        screenProps={screenProps}
        component={TabComponent}
        navigation={this.props.navigation}
        childNavigation={childNavigation}
      />
    );
  };

  _getLabel = ({ route, tintColor, focused }) => {
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

  _getOnPress = (previousScene, { route }) => {
    const options = this.props.router.getScreenOptions(
      this.props.childNavigationProps[route.key],
      this.props.screenProps || {}
    );

    return options.tabBarOnPress;
  };

  _getTestIDProps = ({ route, focused }) => {
    const options = this.props.router.getScreenOptions(
      this.props.childNavigationProps[route.key],
      this.props.screenProps || {}
    );

    return typeof options.tabBarTestIDProps === 'function'
      ? options.tabBarTestIDProps({ focused })
      : options.tabBarTestIDProps;
  };

  _renderIcon = ({ focused, route, tintColor }) => {
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

  _renderTabBar = props => {
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
        tabBarPosition={this.props.tabBarPosition}
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

  _renderPager = props => <TabViewPagerPan {...props} />;

  render() {
    const {
      router,
      tabBarComponent,
      tabBarPosition,
      animationEnabled,
      configureTransition,
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

    let swipeEnabled =
      options.swipeEnabled == null
        ? this.props.swipeEnabled
        : options.swipeEnabled;

    if (typeof swipeEnabled === 'function') {
      swipeEnabled = swipeEnabled(state);
    }

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

    return <TabViewAnimated {...props} />;
  }
}

export default withCachedChildNavigation(TabView);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
