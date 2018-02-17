/**
 * @flow
 */

import React from 'react';
import { SafeAreaView, Text } from 'react-native';
import { TabNavigator, withNavigationFocus } from 'react-navigation';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import SampleText from './SampleText';

const createTabScreen = (name, icon, focusedIcon, tintColor = '#673ab7') => {
  const TabScreen = ({ isFocused }) => (
    <SafeAreaView
      forceInset={{ horizontal: 'always', top: 'always' }}
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text style={{ fontWeight: '700', fontSize: 16, marginBottom: 5 }}>
        {'Tab ' + name.toLowerCase()}
      </Text>
      <Text>{'props.isFocused: ' + (isFocused ? ' true' : 'false')}</Text>
    </SafeAreaView>
  );

  TabScreen.navigationOptions = {
    tabBarLabel: name,
    tabBarIcon: ({ tintColor, focused }) => (
      <MaterialCommunityIcons
        name={focused ? focusedIcon : icon}
        size={26}
        style={{ color: focused ? tintColor : '#ccc' }}
      />
    ),
  };

  return withNavigationFocus(TabScreen);
};

const TabsWithNavigationFocus = TabNavigator(
  {
    One: {
      screen: createTabScreen('One', 'numeric-1-box-outline', 'numeric-1-box'),
    },
    Two: {
      screen: createTabScreen('Two', 'numeric-2-box-outline', 'numeric-2-box'),
    },
    Three: {
      screen: createTabScreen(
        'Three',
        'numeric-3-box-outline',
        'numeric-3-box'
      ),
    },
  },
  {
    tabBarPosition: 'bottom',
    animationEnabled: true,
    swipeEnabled: true,
  }
);

export default TabsWithNavigationFocus;
