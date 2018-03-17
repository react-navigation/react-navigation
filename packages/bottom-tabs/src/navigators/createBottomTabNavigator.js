/* @flow */

import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import createTabNavigator, {
  type InjectedProps,
} from '../utils/createTabNavigator';
import TabBarBottom, { type TabBarOptions } from '../views/TabBarBottom';

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
      tabBarComponent: TabBarComponent = TabBarBottom,
      tabBarOptions,
      navigation,
      onIndexChange,
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
        navigation={navigation}
        jumpToIndex={onIndexChange}
        screenProps={screenProps}
        onTabPress={onTabPress}
        getLabelText={getLabelText}
        renderIcon={renderIcon}
      />
    );
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
              <View
                key={route.key}
                pointerEvents={isFocused ? 'auto' : 'none'}
                style={[
                  StyleSheet.absoluteFill,
                  { opacity: isFocused ? 1 : 0 },
                ]}
              >
                {renderScene({ route })}
              </View>
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
