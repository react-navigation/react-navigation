/* @flow */

import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import createTabNavigator, {
  type InjectedProps,
} from '../utils/createTabNavigator';
import BottomTabBar, { type TabBarOptions } from '../views/BottomTabBar';
import ResourceSavingScene from '../views/ResourceSavingScene';

type Props = InjectedProps & {
  tabBarComponent?: React.ComponentType<*>,
  tabBarOptions?: TabBarOptions,
};

type State = {
  loaded: number[],
};

class TabNavigationView extends React.PureComponent<Props, State> {
  state = {
    loaded: [this.props.navigation.state.index],
  };

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.navigation.state.index !== this.props.navigation.state.index
    ) {
      const { index } = nextProps.navigation.state;

      this.setState(state => ({
        loaded: state.loaded.includes(index)
          ? state.loaded
          : [...state.loaded, index],
      }));
    }
  }

  _getLabel = ({ route, focused, tintColor }) => {
    const label = this.props.getLabelText({ route });

    if (typeof label === 'function') {
      return label({ focused, tintColor });
    }

    return label;
  };

  _renderTabBar = () => {
    const {
      tabBarComponent: TabBarComponent = BottomTabBar,
      tabBarOptions,
      navigation,
      screenProps,
      getLabelText,
      renderIcon,
      onTabPress,
    } = this.props;

    const { descriptors } = this.props;
    const { state } = this.props.navigation;
    const route = state.routes[state.index];
    const descriptor = descriptors[route.key];
    const options = descriptor.options;

    if (options.tabBarVisible === false) {
      return null;
    }

    return (
      <TabBarComponent
        {...tabBarOptions}
        jumpTo={this._jumpTo}
        navigation={navigation}
        screenProps={screenProps}
        onTabPress={onTabPress}
        getLabelText={getLabelText}
        renderIcon={renderIcon}
      />
    );
  };

  _jumpTo = (key: string) => {
    const { navigation, onIndexChange } = this.props;

    const index = navigation.state.routes.findIndex(route => route.key === key);

    onIndexChange(index);
  };

  render() {
    const { navigation, renderScene } = this.props;
    const { routes } = navigation.state;
    const { loaded } = this.state;

    return (
      <View style={styles.container}>
        <View style={styles.pages}>
          {routes.map((route, index) => {
            if (!loaded.includes(index)) {
              // Don't render a screen if we've never navigated to it
              return null;
            }

            const isFocused = navigation.state.index === index;

            return (
              <ResourceSavingScene
                key={route.key}
                style={[
                  StyleSheet.absoluteFill,
                  { opacity: isFocused ? 1 : 0 },
                ]}
                isFocused={isFocused}
              >
                {renderScene({ route })}
              </ResourceSavingScene>
            );
          })}
        </View>
        {this._renderTabBar()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
  },
  pages: {
    flex: 1,
  },
});

export default createTabNavigator(TabNavigationView);
