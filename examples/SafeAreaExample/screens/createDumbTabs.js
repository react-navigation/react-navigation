import React from 'react';
import { Platform, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TabNavigator, TabBarBottom } from 'react-navigation';
import createDumbStack from './createDumbStack';

export default (navigationOptions = {}, DumbStack = createDumbStack()) => {
  return TabNavigator(
    {
      Home: {
        screen: DumbStack,
      },
      Links: {
        screen: DumbStack,
      },
      Settings: {
        screen: DumbStack,
      },
    },
    {
      navigationOptions: ({ navigation }) => ({
        ...navigationOptions,
        tabBarIcon: ({ focused }) => {
          const { routeName } = navigation.state;
          let iconName;
          switch (routeName) {
            case 'Home':
              iconName =
                Platform.OS === 'ios'
                  ? `ios-information-circle${focused ? '' : '-outline'}`
                  : 'md-information-circle';
              break;
            case 'Links':
              iconName =
                Platform.OS === 'ios'
                  ? `ios-link${focused ? '' : '-outline'}`
                  : 'md-link';
              break;
            case 'Settings':
              iconName =
                Platform.OS === 'ios'
                  ? `ios-options${focused ? '' : '-outline'}`
                  : 'md-options';
          }
          return (
            <Ionicons
              name={iconName}
              size={28}
              style={{ marginBottom: -3 }}
              color={focused ? '#6b52ae' : '#ccc'}
            />
          );
        },
      }),
      tabBarOptions: {
        activeTintColor: '#6b52ae',
        ...navigationOptions.tabBarOptions,
        style: {
          backgroundColor: '#F5F1FF',
          ...(navigationOptions.tabBarOptions ? navigationOptions.tabBarOptions.style : {}),
        }
      },
      tabBarComponent: TabBarBottom,
      tabBarPosition: 'bottom',
      animationEnabled: false,
      swipeEnabled: false,
    }
  );
};
