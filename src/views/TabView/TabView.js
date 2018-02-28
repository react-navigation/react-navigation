import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { TabViewAnimated, TabViewPagerPan } from 'react-native-tab-view';
import SafeAreaView from 'react-native-safe-area-view';

import ResourceSavingSceneView from '../ResourceSavingSceneView';

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
    const { screenProps, descriptors } = this.props;
    const {
      lazy,
      removeClippedSubviews,
      animationEnabled,
      swipeEnabled,
    } = this.props.navigationConfig;
    const descriptor = descriptors[route.key];
    const TabComponent = descriptor.getComponent();
    return (
      <ResourceSavingSceneView
        lazy={lazy}
        removeClippedSubViews={removeClippedSubviews}
        animationEnabled={animationEnabled}
        swipeEnabled={swipeEnabled}
        screenProps={screenProps}
        component={TabComponent}
        navigation={this.props.navigation}
        childNavigation={descriptor.navigation}
      />
    );
  };

  _getLabel = ({ route, tintColor, focused }) => {
    const { screenProps, descriptors } = this.props;
    const descriptor = descriptors[route.key];
    const options = descriptor.options;

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
    const { descriptors } = this.props;
    const descriptor = descriptors[route.key];
    const options = descriptor.options;

    return options.tabBarOnPress;
  };

  _getTestIDProps = ({ route }) => {
    const { descriptors } = this.props;
    const descriptor = descriptors[route.key];
    const options = descriptor.options;

    return typeof options.tabBarTestIDProps === 'function'
      ? options.tabBarTestIDProps({ focused })
      : options.tabBarTestIDProps;
  };

  _renderIcon = ({ focused, route, tintColor }) => {
    const { descriptors } = this.props;
    const descriptor = descriptors[route.key];
    const options = descriptor.options;

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
      tabBarPosition,
    } = this.props.navigationConfig;
    if (typeof TabBarComponent === 'undefined') {
      return null;
    }

    return (
      <TabBarComponent
        {...props}
        {...tabBarOptions}
        tabBarPosition={tabBarPosition}
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
      tabBarComponent,
      tabBarPosition,
      animationEnabled,
      configureTransition,
      initialLayout,
    } = this.props.navigationConfig;

    let renderHeader;
    let renderFooter;
    let renderPager;

    const { state } = this.props.navigation;
    const route = state.routes[state.index];
    const { descriptors } = this.props;
    const descriptor = descriptors[route.key];
    const options = descriptor.options;

    const tabBarVisible =
      options.tabBarVisible == null ? true : options.tabBarVisible;

    let swipeEnabled =
      options.swipeEnabled == null
        ? this.props.navigationConfig.swipeEnabled
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
      style: styles.container,
    };

    return <TabViewAnimated {...props} />;
  }
}

export default TabView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
