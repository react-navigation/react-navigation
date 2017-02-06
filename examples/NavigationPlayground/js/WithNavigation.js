/* @flow */

import React from 'react';
import {
  View,
  Text,
  Button,
} from 'react-native';
import { TabNavigator, withNavigation } from 'react-navigation';

const ButtonWithNavigation = withNavigation(({ navigation, to, ...rest }) => (
  <Button {...rest} onPress={() => navigation.navigate(to)} />
));

const createTabWithNavigationButtons = (tabName: string, links: Array<string>) => {
  const Tab = () => (
    <View>
      <Text>This is tab: {tabName}</Text>
      <Text>You can navigate to:</Text>
      {links.map(link => (
        <ButtonWithNavigation key={link} to={link} title={link} />
      ))}
    </View>
  );

  return Tab;
};

export default TabNavigator({
  Tab1: { screen: createTabWithNavigationButtons('Tab1', ['Tab2', 'Tab3']) },
  Tab2: { screen: createTabWithNavigationButtons('Tab2', ['Tab3', 'Tab1']) },
  Tab3: { screen: createTabWithNavigationButtons('Tab2', ['Tab2', 'Tab1']) },
});
