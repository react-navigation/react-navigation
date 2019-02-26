/* @flow */

import * as React from 'react';
import { TabView } from 'react-native-tab-view';
import type { ViewStyleProp } from 'react-native/Libraries/StyleSheet/StyleSheet';
import createTabNavigator, {
  type InjectedProps,
} from '../utils/createTabNavigator';
import MaterialTopTabBar, {
  type TabBarOptions,
} from '../views/MaterialTopTabBar';

type Route = {
  key: string,
  routeName: string,
};

type Props = {|
  ...InjectedProps,
  keyboardDismissMode?: 'none' | 'on-drag',
  swipeEnabled?: boolean,
  swipeDistanceThreshold?: number,
  swipeVelocityThreshold?: number,
  onSwipeStart?: () => mixed,
  onSwipeEnd?: () => mixed,
  initialLayout?: { width?: number, height?: number },
  lazy?: boolean,
  lazyPlaceholderComponent?: React.ComponentType<{ route: Route }>,
  tabBarComponent?: React.ComponentType<*>,
  tabBarOptions?: TabBarOptions,
  tabBarPosition?: 'top' | 'bottom',
  sceneContainerStyle?: ViewStyleProp,
  style?: ViewStyleProp,
|};

class MaterialTabView extends React.PureComponent<Props> {
  _renderLazyPlaceholder = props => {
    const { lazyPlaceholderComponent: LazyPlaceholder } = this.props;

    if (LazyPlaceholder != null) {
      return <LazyPlaceholder {...props} />;
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
      navigation,
      getLabelText,
      getAccessibilityLabel,
      getTestID,
      renderIcon,
      onTabPress,
      onTabLongPress,
      tabBarComponent: TabBarComponent = MaterialTopTabBar,
      tabBarPosition,
      tabBarOptions,
      screenProps,
    } = this.props;

    if (TabBarComponent === null || !tabBarVisible) {
      return null;
    }

    return (
      <TabBarComponent
        {...tabBarOptions}
        {...props}
        tabBarPosition={tabBarPosition}
        screenProps={screenProps}
        navigation={navigation}
        getLabelText={getLabelText}
        getAccessibilityLabel={getAccessibilityLabel}
        getTestID={getTestID}
        renderIcon={renderIcon}
        onTabPress={onTabPress}
        onTabLongPress={onTabLongPress}
      />
    );
  };

  render() {
    const {
      /* eslint-disable no-unused-vars */
      getLabelText,
      getAccessibilityLabel,
      getTestID,
      renderIcon,
      onTabPress,
      onTabLongPress,
      screenProps,
      lazyPlaceholderComponent,
      tabBarComponent,
      tabBarOptions,
      /* eslint-enable no-unused-vars */
      navigation,
      descriptors,
      ...rest
    } = this.props;

    const { state } = navigation;
    const route = state.routes[state.index];

    const descriptor = descriptors[route.key];
    const options = descriptor.options;

    let swipeEnabled =
      options.swipeEnabled == null
        ? this.props.swipeEnabled
        : options.swipeEnabled;

    if (typeof swipeEnabled === 'function') {
      swipeEnabled = swipeEnabled(state);
    }

    return (
      <TabView
        {...rest}
        navigationState={navigation.state}
        swipeEnabled={swipeEnabled}
        renderTabBar={this._renderTabBar}
        renderLazyPlaceholder={this._renderLazyPlaceholder}
      />
    );
  }
}

export default createTabNavigator(MaterialTabView);
