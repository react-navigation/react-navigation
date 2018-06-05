/* @flow */

import * as React from 'react';
import { BottomNavigation } from 'react-native-paper';
import { createTabNavigator, type InjectedProps } from 'react-navigation-tabs';

type Props = InjectedProps & {
  activeTintColor?: string,
  inactiveTintColor?: string,
};

class BottomNavigationView extends React.Component<Props> {
  _getColor = ({ route }) => {
    const { descriptors } = this.props;
    const descriptor = descriptors[route.key];
    const options = descriptor.options;

    return options.tabBarColor;
  };

  render() {
    const {
      activeTintColor,
      inactiveTintColor,
      navigation,
      // eslint-disable-next-line no-unused-vars
      descriptors,
      ...rest
    } = this.props;

    return (
      <BottomNavigation
        {...rest}
        navigationState={navigation.state}
        getColor={this._getColor}
        activeTintColor={activeTintColor}
        inactiveTintColor={inactiveTintColor}
      />
    );
  }
}

export default createTabNavigator(BottomNavigationView);
