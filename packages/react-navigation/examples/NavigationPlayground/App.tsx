import React from 'react';
import {
  Animated,
  Image,
  Platform,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
} from 'react-native';
import {
  NativeViewGestureHandler,
  RectButton,
} from 'react-native-gesture-handler';
import {
  SupportedThemes,
  ThemeColors,
  ThemeContext,
  Themed,
  createAppContainer,
  createStackNavigator,
  SafeAreaView,
} from 'react-navigation';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import CustomTabs from './src/CustomTabs';
import CustomTabUI from './src/CustomTabUI';
import Drawer from './src/Drawer';
import ModalStack from './src/ModalStack';
import SimpleStack from './src/SimpleStack';
import SimpleTabs from './src/SimpleTabs';
import StacksInTabs from './src/StacksInTabs';
import StacksOverTabs from './src/StacksOverTabs';
import StacksOverTopTabs from './src/StacksOverTopTabs';
import StacksAndKeys from './src/StacksAndKeys';
import StackWithCustomHeaderBackImage from './src/StackWithCustomHeaderBackImage';
import StackWithHeaderPreset from './src/StackWithHeaderPreset';
import StackWithTranslucentHeader from './src/StackWithTranslucentHeader';
import SwitchWithStacks from './src/SwitchWithStacks';
import TabsInDrawer from './src/TabsInDrawer';

const ExampleInfo: any = {
  CustomTabUI: {
    description: 'Render additional views around a Tab navigator',
    name: 'Custom Tabs UI',
  },
  CustomTabs: {
    description: 'Custom tabs with tab router',
    name: 'Custom Tabs',
  },
  CustomTransitioner: {
    description: 'Custom transitioner with stack router',
    name: 'Custom Transitioner',
  },
  Drawer: {
    description: 'Android-style drawer navigation',
    name: 'Drawer Example',
  },
  InactiveStack: {
    description:
      'An inactive route in a stack should be given the opportunity to handle actions',
    name: 'Navigate idempotently to stacks in inactive routes',
  },
  KeyboardHandlingExample: {
    description:
      'Demo automatic handling of keyboard showing/hiding inside StackNavigator',
    name: 'Keyboard Handling Example',
  },
  LinkStack: {
    description: 'Deep linking into a route in stack',
    name: 'Link in Stack',
  },
  LinkTabs: {
    description: 'Deep linking into a route in tab',
    name: 'Link to Settings Tab',
  },
  ModalStack: {
    description:
      Platform.OS === 'ios'
        ? 'Stack navigation with modals'
        : 'Dynamically showing and hiding the header',
    name:
      Platform.OS === 'ios'
        ? 'Modal Stack Example'
        : 'Stack with Dynamic Header',
  },
  SimpleStack: {
    description: 'A card stack',
    name: 'Stack Example',
  },
  SimpleTabs: {
    description: 'Tabs following platform conventions',
    name: 'Tabs Example',
  },
  StackWithCustomHeaderBackImage: {
    description: 'Stack with custom header back image',
    name: 'Custom header back image',
  },
  StackWithHeaderPreset: {
    description: 'Masked back button and sliding header items. iOS only.',
    name: 'UIKit-style Header Transitions',
  },
  StackWithTranslucentHeader: {
    description: 'Render arbitrary translucent content in header background.',
    name: 'Translucent Header',
  },
  StacksInTabs: {
    description: 'Nested stack navigation in tabs',
    name: 'Stacks in Tabs',
  },
  StacksOverTabs: {
    description: 'Nested stack navigation that pushes on top of tabs',
    name: 'Stacks over Tabs',
  },
  StacksOverTopTabs: {
    description: 'Tab navigator in stack with custom header heights',
    name: 'Stacks with non-standard header height',
  },
  StacksAndKeys: {
    description: 'Use keys to link between screens',
    name: 'Link in Stack with keys',
  },
  SwitchWithStacks: {
    description: 'Jump between routes',
    name: 'Switch between routes',
  },
  // MultipleDrawer: {
  //   description: 'Add any drawer you need',
  //   name: 'Multiple Drawer Example',
  // },
  TabsInDrawer: {
    description: 'A drawer combined with tabs',
    name: 'Drawer + Tabs Example',
  },
  TabsWithNavigationEvents: {
    description:
      'Declarative NavigationEvents component to subscribe to navigation events',
    name: 'NavigationEvents',
  },
  TabsWithNavigationFocus: {
    description: 'Receive the focus prop to know when a screen is focused',
    name: 'withNavigationFocus',
  },
};

const ExampleRoutes: any = {
  CustomTabUI,
  CustomTabs,
  Drawer,
  ModalStack,
  SimpleStack,
  SimpleTabs,
  StackWithCustomHeaderBackImage,
  StackWithTranslucentHeader,
  StacksAndKeys,
  StacksOverTabs,
  SwitchWithStacks,
  StacksOverTopTabs,
  StacksInTabs,
  ...Platform.select({
    android: {},
    ios: {
      StackWithHeaderPreset,
    },
  }),
  TabsInDrawer,
  LinkStack: {
    screen: SimpleStack,
    path: 'people/Jordan',
  },
  LinkTabs: {
    screen: SimpleTabs,
    path: 'settings',
  },
};

interface State {
  scrollY: Animated.Value;
}

class MainScreen extends React.Component<any, State> {
  static contextType = ThemeContext;
  context!: React.ContextType<typeof ThemeContext>;

  state = {
    scrollY: new Animated.Value(0),
  };

  render() {
    const { navigation } = this.props;

    const scale = this.state.scrollY.interpolate({
      extrapolate: 'clamp',
      inputRange: [-450, 0, 100],
      outputRange: [2, 1, 0.8],
    });

    const translateY = this.state.scrollY.interpolate({
      inputRange: [-450, 0, 100],
      outputRange: [-150, 0, 40],
    });

    const opacity = this.state.scrollY.interpolate({
      extrapolate: 'clamp',
      inputRange: [0, 50],
      outputRange: [1, 0],
    });

    const underlayOpacity = this.state.scrollY.interpolate({
      extrapolate: 'clamp',
      inputRange: [0, 50],
      outputRange: [0, 1],
    });

    const backgroundScale = this.state.scrollY.interpolate({
      extrapolate: 'clamp',
      inputRange: [-450, 0],
      outputRange: [3, 1],
    });

    const backgroundTranslateY = this.state.scrollY.interpolate({
      inputRange: [-450, 0],
      outputRange: [0, 0],
    });

    return (
      <View style={{ flex: 1 }}>
        <NativeViewGestureHandler>
          <Animated.ScrollView
            style={{ flex: 1, backgroundColor: ThemeColors[this.context].body }}
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
                    source={require('./src/assets/NavLogo.png')}
                    style={styles.bannerImage}
                  />
                  <Text style={styles.bannerTitle}>
                    React Navigation Examples
                  </Text>
                </View>
              </SafeAreaView>
            </Animated.View>

            <SafeAreaView
              forceInset={{ top: 'never', bottom: 'always' }}
              style={{ backgroundColor: '#eee' }}
            >
              <View
                style={{
                  backgroundColor: ThemeColors[this.context].bodyContent,
                }}
              >
                {Object.keys(ExampleRoutes).map((routeName: string) => (
                  <RectButton
                    key={routeName}
                    underlayColor="#ccc"
                    activeOpacity={0.3}
                    onPress={() => {
                      const route = ExampleRoutes[routeName];
                      if (route.screen || route.path || route.params) {
                        const { path, params, screen } = route;
                        const { router } = screen;
                        const action =
                          path &&
                          router.getActionForPathAndParams(path, params);
                        navigation.navigate(routeName, {}, action);
                      } else {
                        navigation.navigate(routeName);
                      }
                    }}
                  >
                    <View
                      style={[
                        styles.item,
                        this.context === 'dark'
                          ? styles.itemDark
                          : styles.itemLight,
                      ]}
                    >
                      <Themed.Text style={styles.title}>
                        {ExampleInfo[routeName].name}
                      </Themed.Text>
                      <Text style={styles.description}>
                        {ExampleInfo[routeName].description}
                      </Text>
                    </View>
                  </RectButton>
                ))}
              </View>
            </SafeAreaView>
          </Animated.ScrollView>
        </NativeViewGestureHandler>
        <StatusBar barStyle="light-content" />
        <Animated.View
          style={[styles.statusBarUnderlay, { opacity: underlayOpacity }]}
        />
      </View>
    );
  }
}

const Navigation = createAppContainer(
  createStackNavigator(
    {
      ...ExampleRoutes,
      Index: {
        screen: MainScreen,
      },
    },
    {
      headerMode: 'none',
      initialRouteName: 'Index',

      /*
       * Use modal on iOS because the card mode comes from the right,
       * which conflicts with the drawer example gesture
       */
      mode: Platform.OS === 'ios' ? 'modal' : 'card',
    }
  )
);

export default () => {
  let [theme, setTheme] = React.useState<SupportedThemes>('light');

  return (
    <View style={{ flex: 1 }}>
      <Navigation theme={theme} />
      <View style={{ position: 'absolute', bottom: 60, right: 20 }}>
        <TouchableOpacity
          onPress={() => {
            setTheme(theme === 'light' ? 'dark' : 'light');
          }}
        >
          <View
            style={{
              backgroundColor: ThemeColors[theme].bodyContent,
              borderRadius: 25,
              width: 50,
              height: 50,
              alignItems: 'center',
              justifyContent: 'center',
              borderColor: ThemeColors[theme].bodyBorder,
              borderWidth: 1,
              shadowColor: ThemeColors[theme].label,
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.4,
              shadowRadius: 2,

              elevation: 5,
            }}
          >
            <MaterialCommunityIcons
              name="theme-light-dark"
              size={30}
              color={ThemeColors[theme].label}
            />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  backgroundUnderlay: {
    backgroundColor: '#673ab7',
    height: 300,
    left: 0,
    position: 'absolute',
    right: 0,
    top: -100,
  },
  banner: {
    alignItems: 'center',
    flexDirection: 'row',
    padding: 16,
  },
  bannerContainer: {
    // backgroundColor: '#673ab7',
    alignItems: 'center',
  },
  bannerImage: {
    height: 36,
    margin: 8,
    resizeMode: 'contain',
    tintColor: '#fff',
    width: 36,
  },
  bannerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '200',
    marginRight: 5,
    marginVertical: 8,
  },
  description: {
    color: '#999',
    fontSize: 13,
  },
  image: {
    alignSelf: 'center',
    height: 120,
    marginBottom: 20,
    resizeMode: 'contain',
    width: 120,
  },
  item: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  itemLight: {
    borderBottomColor: ThemeColors.light.bodyBorder,
  },
  itemDark: {
    borderBottomColor: ThemeColors.dark.bodyBorder,
  },
  statusBarUnderlay: {
    backgroundColor: '#673ab7',
    height: 20,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
