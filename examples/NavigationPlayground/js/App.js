/* @flow */

import React from 'react';
import { Constants, ScreenOrientation } from 'expo';

ScreenOrientation.allow(ScreenOrientation.Orientation.ALL);

import {
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Text,
  StatusBar,
  View,
} from 'react-native';
import { SafeAreaView, StackNavigator } from 'react-navigation';

import Banner from './Banner';
import CustomTabs from './CustomTabs';
import CustomTransitioner from './CustomTransitioner';
import Drawer from './Drawer';
import MultipleDrawer from './MultipleDrawer';
import TabsInDrawer from './TabsInDrawer';
import ModalStack from './ModalStack';
import StacksInTabs from './StacksInTabs';
import StacksOverTabs from './StacksOverTabs';
import SimpleStack from './SimpleStack';
import SimpleTabs from './SimpleTabs';
import TabAnimations from './TabAnimations';

const ExampleInfo = {
  SimpleStack: {
    name: 'Stack Example',
    description: 'A card stack',
  },
  SimpleTabs: {
    name: 'Tabs Example',
    description: 'Tabs following platform conventions',
  },
  Drawer: {
    name: 'Drawer Example',
    description: 'Android-style drawer navigation',
  },
  // MultipleDrawer: {
  //   name: 'Multiple Drawer Example',
  //   description: 'Add any drawer you need',
  // },
  TabsInDrawer: {
    name: 'Drawer + Tabs Example',
    description: 'A drawer combined with tabs',
  },
  CustomTabs: {
    name: 'Custom Tabs',
    description: 'Custom tabs with tab router',
  },
  CustomTransitioner: {
    name: 'Custom Transitioner',
    description: 'Custom transitioner with stack router',
  },
  ModalStack: {
    name:
      Platform.OS === 'ios'
        ? 'Modal Stack Example'
        : 'Stack with Dynamic Header',
    description:
      Platform.OS === 'ios'
        ? 'Stack navigation with modals'
        : 'Dynamically showing and hiding the header',
  },
  StacksInTabs: {
    name: 'Stacks in Tabs',
    description: 'Nested stack navigation in tabs',
  },
  StacksOverTabs: {
    name: 'Stacks over Tabs',
    description: 'Nested stack navigation that pushes on top of tabs',
  },
  LinkStack: {
    name: 'Link in Stack',
    description: 'Deep linking into a route in stack',
  },
  LinkTabs: {
    name: 'Link to Settings Tab',
    description: 'Deep linking into a route in tab',
  },
  TabAnimations: {
    name: 'Animated Tabs Example',
    description: 'Tab transitions have custom animations',
  },
};
const ExampleRoutes = {
  SimpleStack: {
    screen: SimpleStack,
  },
  SimpleTabs: {
    screen: SimpleTabs,
  },
  Drawer: {
    screen: Drawer,
  },
  // MultipleDrawer: {
  //   screen: MultipleDrawer,
  // },
  TabsInDrawer: {
    screen: TabsInDrawer,
  },
  CustomTabs: {
    screen: CustomTabs,
  },
  CustomTransitioner: {
    screen: CustomTransitioner,
  },
  ModalStack: {
    screen: ModalStack,
  },
  StacksInTabs: {
    screen: StacksInTabs,
  },
  StacksOverTabs: {
    screen: StacksOverTabs,
  },
  LinkStack: {
    screen: SimpleStack,
    path: 'people/Jordan',
  },
  LinkTabs: {
    screen: SimpleTabs,
    path: 'settings',
  },
  TabAnimations: {
    screen: TabAnimations,
  },
};

class MainScreen extends React.Component<*> {
  render() {
    const { navigation } = this.props;

    return (
      <View style={{ flex: 1 }}>
        <ScrollView style={{ flex: 1 }}>
          <Banner />
          {Object.keys(ExampleRoutes).map((routeName: string) => (
            <TouchableOpacity
              key={routeName}
              onPress={() => {
                const { path, params, screen } = ExampleRoutes[routeName];
                const { router } = screen;
                const action =
                  path && router.getActionForPathAndParams(path, params);
                navigation.navigate(routeName, {}, action);
              }}
            >
              <SafeAreaView
                style={styles.itemContainer}
                forceInset={{ vertical: 'never' }}
              >
                <View style={styles.item}>
                  <Text style={styles.title}>
                    {ExampleInfo[routeName].name}
                  </Text>
                  <Text style={styles.description}>
                    {ExampleInfo[routeName].description}
                  </Text>
                </View>
              </SafeAreaView>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <StatusBar barStyle="light-content" />
        <View style={styles.statusBarUnderlay} />
      </View>
    );
  }
}

const AppNavigator = StackNavigator(
  {
    ...ExampleRoutes,
    Index: {
      screen: MainScreen,
    },
  },
  {
    initialRouteName: 'Index',
    headerMode: 'none',

    /*
   * Use modal on iOS because the card mode comes from the right,
   * which conflicts with the drawer example gesture
   */
    mode: Platform.OS === 'ios' ? 'modal' : 'card',
  }
);

export default () => <AppNavigator />;

const styles = StyleSheet.create({
  item: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  itemContainer: {
    backgroundColor: '#fff',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ddd',
  },
  image: {
    width: 120,
    height: 120,
    alignSelf: 'center',
    marginBottom: 20,
    resizeMode: 'contain',
  },
  statusBarUnderlay: {
    backgroundColor: '#673ab7',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: Constants.statusBarHeight,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#444',
  },
  description: {
    fontSize: 13,
    color: '#999',
  },
});
