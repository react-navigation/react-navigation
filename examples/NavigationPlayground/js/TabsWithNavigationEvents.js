/**
 * @flow
 */

import React from 'react';
import { FlatList, SafeAreaView, StatusBar, Text, View } from 'react-native';
import { NavigationEvents } from 'react-navigation';
import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const Event = ({ event }) => (
  <View
    style={{
      borderColor: 'grey',
      borderWidth: 1,
      borderRadius: 3,
      padding: 5,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    }}
  >
    <Text>{event.type}</Text>
    <Text>
      {event.action.type.replace('Navigation/', '')}
      {event.action.routeName ? '=>' + event.action.routeName : ''}
    </Text>
  </View>
);

const createTabScreen = (name, icon, focusedIcon) => {
  class TabScreen extends React.Component<any, any> {
    static navigationOptions = {
      tabBarLabel: name,
      tabBarIcon: ({ tintColor, focused }) => (
        <MaterialCommunityIcons
          name={focused ? focusedIcon : icon}
          size={26}
          style={{ color: focused ? tintColor : '#ccc' }}
        />
      ),
    };

    state = { eventLog: [] };

    append = navigationEvent => {
      this.setState(({ eventLog }) => ({
        eventLog: eventLog.concat(navigationEvent),
      }));
    };

    render() {
      return (
        <SafeAreaView
          forceInset={{ horizontal: 'always', top: 'always' }}
          style={{
            flex: 1,
          }}
        >
          <Text
            style={{
              margin: 10,
              marginTop: 30,
              fontSize: 30,
              fontWeight: 'bold',
            }}
          >
            Events for tab {name}
          </Text>

          <View style={{ flex: 1, width: '100%', marginTop: 10 }}>
            <FlatList
              data={this.state.eventLog}
              keyExtractor={item => `${this.state.eventLog.indexOf(item)}`}
              renderItem={({ item }) => (
                <View
                  style={{
                    marginVertical: 5,
                    marginHorizontal: 10,
                    backgroundColor: '#e4e4e4',
                  }}
                >
                  <Event event={item} />
                </View>
              )}
            />
          </View>

          <NavigationEvents
            onWillFocus={this.append}
            onDidFocus={this.append}
            onWillBlur={this.append}
            onDidBlur={this.append}
          />

          <StatusBar barStyle="default" />
        </SafeAreaView>
      );
    }
  }

  return TabScreen;
};

const TabsWithNavigationEvents = createMaterialBottomTabNavigator(
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
    shifting: false,
    activeTintColor: '#F44336',
  }
);

export default TabsWithNavigationEvents;
