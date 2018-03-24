/* @flow */

import * as React from 'react';
import { Platform } from 'react-native';
import { TabViewAnimated, TabViewPagerPan } from 'react-native-tab-view';
import createTabNavigator, {
  type InjectedProps,
} from '../utils/createTabNavigator';
import MaterialTopTabBar, {
  type TabBarOptions,
} from '../views/MaterialTopTabBar';

type Props = InjectedProps & {
  animationEnabled?: boolean,
  swipeEnabled?: boolean,
  tabBarPosition?: 'top' | 'bottom',
  tabBarComponent?: React.ComponentType<*>,
  tabBarOptions?: TabBarOptions,
};

class TabView extends React.PureComponent<Props> {
  static defaultProps = {
    // fix for https://github.com/react-native-community/react-native-tab-view/issues/312
    initialLayout: Platform.select({
      android: { width: 1, height: 0 },
    }),
  };

  _getLabel = ({ route, tintColor, focused }) => {
    const { descriptors } = this.props;
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

  _getTestIDProps = ({ route, focused }) => {
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
    const { state } = this.props.navigation;
    const route = state.routes[state.index];
    const { descriptors } = this.props;
    const descriptor = descriptors[route.key];
    const options = descriptor.options;

    const tabBarVisible =
      options.tabBarVisible == null ? true : options.tabBarVisible;

    const {
      tabBarComponent: TabBarComponent = MaterialTopTabBar,
      tabBarPosition,
      tabBarOptions,
    } = this.props;

    if (TabBarComponent === null || !tabBarVisible) {
      return null;
    }

    return (
      <TabBarComponent
        {...tabBarOptions}
        {...props}
        tabBarPosition={tabBarPosition}
        screenProps={this.props.screenProps}
        navigation={this.props.navigation}
        getLabelText={this.props.getLabelText}
        getTestIDProps={this._getTestIDProps}
        renderIcon={this._renderIcon}
      />
    );
  };

  _renderPanPager = props => <TabViewPagerPan {...props} />;

  render() {
    const {
      navigation,
      tabBarPosition,
      animationEnabled,
      renderScene,
      ...rest
    } = this.props;

    let renderHeader;
    let renderFooter;
    let renderPager;

    const { state } = this.props.navigation;
    const route = state.routes[state.index];
    const { descriptors } = this.props;
    const descriptor = descriptors[route.key];
    const options = descriptor.options;

    let swipeEnabled =
      options.swipeEnabled == null
        ? this.props.swipeEnabled
        : options.swipeEnabled;

    if (typeof swipeEnabled === 'function') {
      swipeEnabled = swipeEnabled(state);
    }

    if (tabBarPosition === 'bottom') {
      renderFooter = this._renderTabBar;
    } else {
      renderHeader = this._renderTabBar;
    }

    if (animationEnabled === false && swipeEnabled === false) {
      renderPager = this._renderPanPager;
    }

    return (
      <TabViewAnimated
        {...rest}
        navigationState={navigation.state}
        animationEnabled={animationEnabled}
        swipeEnabled={swipeEnabled}
        renderScene={
          /* $FlowFixMe */
          renderScene
        }
        renderPager={renderPager}
        renderHeader={renderHeader}
        renderFooter={renderFooter}
      />
    );
  }
}

export default createTabNavigator(TabView);
