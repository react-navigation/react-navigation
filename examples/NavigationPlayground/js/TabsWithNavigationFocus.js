/**
 * @flow
 */

import React from 'react';
import { SafeAreaView } from 'react-native';
import { TabNavigator, withNavigationFocus } from 'react-navigation';

import SampleText from './SampleText';

const createTabScreen = name => {
  const TabScreen = ({ isFocused }) => (
    <SafeAreaView
      forceInset={{ horizontal: 'always', top: 'always' }}
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <SampleText>{'Tab=' + name}</SampleText>
      <SampleText>{'IsFocused=' + isFocused ? 'true' : 'false'}</SampleText>
    </SafeAreaView>
  );

  return withNavigationFocus(TabScreen);
};

const TabsWithNavigationFocus = TabNavigator(
  {
    One: {
      screen: createTabScreen('One'),
    },
    Two: {
      screen: createTabScreen('Two'),
    },
    Three: {
      screen: createTabScreen('Three'),
    },
  },
  {
    tabBarPosition: 'bottom',
    animationEnabled: true,
    swipeEnabled: true,
  }
);

export default TabsWithNavigationFocus;
