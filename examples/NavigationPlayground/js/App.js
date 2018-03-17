/* @flow */

import React from 'react';
import { Asset, Constants, ScreenOrientation } from 'expo';

ScreenOrientation.allow(ScreenOrientation.Orientation.ALL);

import {
  Animated,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Text,
  StatusBar,
  View,
} from 'react-native';
import { SafeAreaView, StackNavigator } from 'react-navigation';

import CustomTabs from './CustomTabs';
import CustomTransitioner from './CustomTransitioner';
import Drawer from './Drawer';
import MultipleDrawer from './MultipleDrawer';
import TabsInDrawer from './TabsInDrawer';
import ModalStack from './ModalStack';
import StacksInTabs from './StacksInTabs';
import SwitchWithStacks from './SwitchWithStacks';
import StacksOverTabs from './StacksOverTabs';
import StacksWithKeys from './StacksWithKeys';
import SimpleStack from './SimpleStack';
import StackWithHeaderPreset from './StackWithHeaderPreset';
import StackWithTranslucentHeader from './StackWithTranslucentHeader';
import SimpleTabs from './SimpleTabs';
import CustomTabNavigator from './CustomTabNavigator';
import TabAnimations from './TabAnimations';
import TabsWithNavigationFocus from './TabsWithNavigationFocus';

const ExampleInfo = {
  SimpleStack: {
    name: 'Stack Example',
    description: 'A card stack',
  },
  SwitchWithStacks: {
    name: 'Switch Example',
    description: 'A switch with stacks inside',
  },
  SimpleTabs: {
    name: 'Tabs Example',
    description: 'Tabs following platform conventions',
  },
  Drawer: {
    name: 'Drawer Example',
    description: 'Android-style drawer navigation',
  },
  StackWithHeaderPreset: {
    name: 'UIKit-style Header Transitions',
    description: 'Masked back button and sliding header items. iOS only.',
  },
  StackWithHeaderPreset: {
    name: 'UIKit-style Header Transitions',
    description: 'Masked back button and sliding header items. iOS only.',
  },
  StackWithTranslucentHeader: {
    name: 'Translucent Header',
    description: 'Render arbitrary translucent content in header background.',
  },
  // MultipleDrawer: {
  //   name: 'Multiple Drawer Example',
  //   description: 'Add any drawer you need',
  // },
  TabsInDrawer: {
    name: 'Drawer + Tabs Example',
    description: 'A drawer combined with tabs',
  },
  CustomTabNavigator: {
    name: 'Custom Tab Navigator Example',
    description: 'Extending the tab navigator',
  },
  CustomTabs: {
    name: 'Custom Tabs View',
    description: 'Custom tabs using TabRouter',
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
  StacksWithKeys: {
    name: 'Link in Stack with keys',
    description: 'Use keys to link between screens',
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
  TabsWithNavigationFocus: {
    name: 'withNavigationFocus',
    description: 'Receive the focus prop to know when a screen is focused',
  },
};

const ExampleRoutes = {
  SimpleStack,
  SwitchWithStacks,
  SimpleTabs,
  Drawer,
  // MultipleDrawer: {
  //   screen: MultipleDrawer,
  // },
  StackWithHeaderPreset,
  StackWithTranslucentHeader,
  TabsInDrawer,
  CustomTabs,
  CustomTransitioner,
  ModalStack,
  StacksWithKeys,
  StacksInTabs,
  StacksOverTabs,
  CustomTabNavigator,
  LinkStack: {
    screen: SimpleStack,
    path: 'people/Jordan',
  },
  LinkTabs: {
    screen: SimpleTabs,
    path: 'settings',
  },
  TabAnimations,
  TabsWithNavigationFocus,
};

type State = {
  scrollY: Animated.Value,
};
class MainScreen extends React.Component<any, State> {
  state = {
    scrollY: new Animated.Value(0),
  };

  componentWillMount() {
    Asset.fromModule(
      require('react-navigation/src/views/assets/back-icon-mask.png')
    ).downloadAsync();
    Asset.fromModule(
      require('react-navigation/src/views/assets/back-icon.png')
    ).downloadAsync();
  }

  render() {
    const { navigation } = this.props;

    const scale = this.state.scrollY.interpolate({
      inputRange: [-450, 0, 100],
      outputRange: [2, 1, 0.8],
      extrapolate: 'clamp',
    });

    const translateY = this.state.scrollY.interpolate({
      inputRange: [-450, 0, 100],
      outputRange: [-150, 0, 40],
    });

    const opacity = this.state.scrollY.interpolate({
      inputRange: [0, 50],
      outputRange: [1, 0],
      extrapolate: 'clamp',
    });

    const underlayOpacity = this.state.scrollY.interpolate({
      inputRange: [0, 50],
      outputRange: [0, 1],
      extrapolate: 'clamp',
    });

    const backgroundScale = this.state.scrollY.interpolate({
      inputRange: [-450, 0],
      outputRange: [3, 1],
      extrapolate: 'clamp',
    });

    const backgroundTranslateY = this.state.scrollY.interpolate({
      inputRange: [-450, 0],
      outputRange: [0, 0],
    });

    return (
      <View style={{ flex: 1 }}>
        <Animated.ScrollView
          style={{ flex: 1 }}
          scrollEventThrottle={1}
          onScroll={Animated.event(
            [
              {
                nativeEvent: { contentOffset: { y: this.state.scrollY } },
              },
            ],
            { useNativeDriver: true }
          )}
        >
          <Animated.View
            style={[
              styles.backgroundUnderlay,
              {
                transform: [
                  { scale: backgroundScale },
                  { translateY: backgroundTranslateY },
                ],
              },
            ]}
          />
          <Animated.View
            style={{ opacity, transform: [{ scale }, { translateY }] }}
          >
            <SafeAreaView
              style={styles.bannerContainer}
              forceInset={{ top: 'always', bottom: 'never' }}
            >
              <View style={styles.banner}>
                <Image
                  source={require('./assets/NavLogo.png')}
                  style={styles.bannerImage}
                />
                <Text style={styles.bannerTitle}>
                  React Navigation Examples
                </Text>
              </View>
            </SafeAreaView>
          </Animated.View>

          <SafeAreaView forceInset={{ bottom: 'always', horizontal: 'never' }}>
            <View style={{ backgroundColor: '#fff' }}>
              {Object.keys(ExampleRoutes).map((routeName: string) => (
                <TouchableOpacity
                  key={routeName}
                  onPress={() => {
                    let route = ExampleRoutes[routeName];
                    if (route.screen || route.path || route.params) {
                      const { path, params, screen } = route;
                      const { router } = screen;
                      const action =
                        path && router.getActionForPathAndParams(path, params);
                      navigation.navigate(routeName, {}, action);
                    } else {
                      navigation.navigate(routeName);
                    }
                  }}
                >
                  <SafeAreaView
                    style={styles.itemContainer}
                    forceInset={{ veritcal: 'never', bottom: 'never' }}
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
            </View>
          </SafeAreaView>
        </Animated.ScrollView>
        <StatusBar barStyle="light-content" />
        <Animated.View
          style={[styles.statusBarUnderlay, { opacity: underlayOpacity }]}
        />
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
  backgroundUnderlay: {
    backgroundColor: '#673ab7',
    position: 'absolute',
    top: -100,
    height: 300,
    left: 0,
    right: 0,
  },
  bannerContainer: {
    // backgroundColor: '#673ab7',
    alignItems: 'center',
  },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  bannerImage: {
    width: 36,
    height: 36,
    resizeMode: 'contain',
    tintColor: '#fff',
    margin: 8,
  },
  bannerTitle: {
    fontSize: 18,
    fontWeight: '200',
    color: '#fff',
    marginVertical: 8,
    marginRight: 5,
  },
});
