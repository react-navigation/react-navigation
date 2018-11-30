/* @flow */

import * as React from 'react';
import { View, Platform } from 'react-native';
import { polyfill } from 'react-lifecycles-compat';
import { TabView, PagerPan } from 'react-native-tab-view';
import createTabNavigator, {
  type InjectedProps,
} from '../utils/createTabNavigator';
import MaterialTopTabBar, {
  type TabBarOptions,
} from '../views/MaterialTopTabBar';
import ResourceSavingScene from '../views/ResourceSavingScene';

type Props = InjectedProps & {
  animationEnabled?: boolean,
  lazy?: boolean,
  optimizationsEnabled?: boolean,
  swipeEnabled?: boolean,
  renderPager?: (props: *) => React.Node,
  tabBarComponent?: React.ComponentType<*>,
  tabBarOptions?: TabBarOptions,
  tabBarPosition?: 'top' | 'bottom',
};

type State = {
  index: number,
  isSwiping: boolean,
  loaded: Array<number>,
  transitioningFromIndex: ?number,
};

class MaterialTabView extends React.PureComponent<Props, State> {
  static defaultProps = {
    // fix for https://github.com/react-native-community/react-native-tab-view/issues/312
    initialLayout: Platform.select({
      android: { width: 1, height: 0 },
    }),
    animationEnabled: true,
    lazy: false,
    optimizationsEnabled: false,
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    const { index } = nextProps.navigation.state;

    if (prevState.index === index) {
      return null;
    }

    return {
      loaded: prevState.loaded.includes(index)
        ? prevState.loaded
        : [...prevState.loaded, index],
      index,
    };
  }

  state = {
    index: 0,
    isSwiping: false,
    loaded: [this.props.navigation.state.index],
    transitioningFromIndex: null,
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
      /* $FlowFixMe */
      <TabBarComponent
        {...tabBarOptions}
        {...props}
        tabBarPosition={tabBarPosition}
        screenProps={this.props.screenProps}
        navigation={this.props.navigation}
        getLabelText={this.props.getLabelText}
        getAccessibilityLabel={this.props.getAccessibilityLabel}
        getTestID={this.props.getTestID}
        renderIcon={this._renderIcon}
        onTabPress={this.props.onTabPress}
        onTabLongPress={this.props.onTabLongPress}
      />
    );
  };

  _renderPanPager = props => <PagerPan {...props} />;

  _handleAnimationEnd = () => {
    const { lazy } = this.props;

    if (lazy) {
      this.setState({
        transitioningFromIndex: null,
        isSwiping: false,
      });
    }
  };

  _handleSwipeStart = () => {
    const { navigation, lazy } = this.props;

    if (lazy) {
      this.setState({
        isSwiping: true,
        loaded: [
          ...new Set([
            ...this.state.loaded,
            Math.max(navigation.state.index - 1, 0),
            Math.min(
              navigation.state.index + 1,
              navigation.state.routes.length - 1
            ),
          ]),
        ],
      });
    }
  };

  _handleIndexChange = index => {
    const { animationEnabled, navigation, onIndexChange, lazy } = this.props;

    if (lazy && animationEnabled) {
      this.setState({
        transitioningFromIndex: navigation.state.index || 0,
      });
    }

    onIndexChange(index);
  };

  _mustBeVisible = ({ index, focused }) => {
    const { animationEnabled, navigation } = this.props;
    const { isSwiping, transitioningFromIndex } = this.state;

    if (isSwiping) {
      const isSibling =
        navigation.state.index === index - 1 ||
        navigation.state.index === index + 1;

      if (isSibling) {
        return true;
      }
    }

    // The previous tab should remain visible while transitioning
    if (animationEnabled && transitioningFromIndex === index) {
      return true;
    }

    return focused;
  };

  _renderScene = ({ route }) => {
    const { renderScene, descriptors, lazy, optimizationsEnabled } = this.props;

    if (lazy) {
      const { loaded } = this.state;
      const { routes } = this.props.navigation.state;
      const index = routes.findIndex(({ key }) => key === route.key);
      const { navigation } = descriptors[route.key];

      const mustBeVisible = this._mustBeVisible({
        index,
        focused: navigation.isFocused(),
      });

      if (!loaded.includes(index) && !mustBeVisible) {
        return <View />;
      }

      if (optimizationsEnabled) {
        return (
          <ResourceSavingScene isVisible={mustBeVisible}>
            {renderScene({ route })}
          </ResourceSavingScene>
        );
      }
    }

    return renderScene({ route });
  };

  render() {
    const {
      navigation,
      animationEnabled,
      // eslint-disable-next-line no-unused-vars
      renderScene,
      // eslint-disable-next-line no-unused-vars
      onIndexChange,
      ...rest
    } = this.props;

    let renderPager = rest.renderPager;

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

    if (animationEnabled === false && swipeEnabled === false) {
      renderPager = this._renderPanPager;
    }

    return (
      <TabView
        {...rest}
        navigationState={navigation.state}
        animationEnabled={animationEnabled}
        swipeEnabled={swipeEnabled}
        onAnimationEnd={this._handleAnimationEnd}
        onIndexChange={this._handleIndexChange}
        onSwipeStart={this._handleSwipeStart}
        renderPager={renderPager}
        renderTabBar={this._renderTabBar}
        renderScene={
          /* $FlowFixMe */
          this._renderScene
        }
      />
    );
  }
}

polyfill(MaterialTabView);

export default createTabNavigator(MaterialTabView);
