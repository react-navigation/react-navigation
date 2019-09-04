import React, { Component } from 'react';
import {
  Text,
  View,
  ScrollView,
  Dimensions,
  TouchableOpacity,
} from 'react-native';

import { Themed } from '@react-navigation/native';
import { createStackNavigator } from 'react-navigation-stack';
import { createDrawerNavigator } from 'react-navigation-drawer';

class RightDrawer extends Component {
  state = {
    categories: [{ i: 'c1', n: 'name1' }, { i: 'c2', n: 'name2' }],
  };

  render() {
    return (
      <View style={{ backgroundColor: 'white', flex: 1 }}>
        <ScrollView
          style={{ height: '100%', width: '100%', backgroundColor: '#333333' }}
        >
          {this.state.categories.map(key => {
            return (
              <TouchableOpacity
                key={key.n}
                onPress={() => {
                  let nid = key.i;
                  this.props.navigation.navigate('CategoryScreen', {
                    id: nid,
                    title: key.n,
                  });
                  this.props.navigation.closeDrawer();
                }}
              >
                <View
                  style={{
                    width: '100%',
                    height: 60,
                    justifyContent: 'center',
                  }}
                >
                  <Text
                    style={{
                      color: 'white',
                      height: 32.5,
                      width: '100%',
                      paddingRight: 20,
                      fontSize: 20,
                    }}
                  >
                    {key.n}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
        <Themed.StatusBar barStyle="light-content" />
      </View>
    );
  }
}

const CategoryScreen = ({ navigation }) => {
  return (
    <View>
      <Themed.Text>CategoryScreen {navigation.getParam('title')}</Themed.Text>
    </View>
  );
};

const AppNavigator = createStackNavigator(
  {
    CategoryScreen,
  },
  {
    defaultNavigationOptions: {
      title: 'RTL Test',
      headerStyle: {
        backgroundColor: '#0f5599',
      },
      headerTintColor: 'white',
      headerBackTitleStyle: {
        color: 'white',
      },
    },
  }
);
const DrawerNavigator = createDrawerNavigator(
  {
    Item1: {
      screen: AppNavigator,
    },
  },
  {
    contentComponent: RightDrawer,
    drawerLockMode: 'unlocked',
    drawerPosition: 'right',
    drawerWidth: () => {
      return Dimensions.get('window').width - 150;
    },
    drawerType: 'slide',
    drawerBackgroundColor: '#333333',
    backBehavior: 'none',
  }
);

export default DrawerNavigator;
