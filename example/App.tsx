import React from 'react';
import { registerRootComponent } from 'expo';
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
  SafeAreaView,
} from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AnimatedSwitch from './src/AnimatedSwitch';
import BottomTabs from './src/BottomTabs';
import CustomTabs from './src/CustomTabs';
import CustomTabUI from './src/CustomTabUI';
import Drawer from './src/Drawer';
import ModalStack from './src/ModalStack';
import SimpleStack from './src/SimpleStack';
import StacksAndKeys from './src/StacksAndKeys';
import StacksInTabs from './src/StacksInTabs';
import StacksOverTabs from './src/StacksOverTabs';
import StacksOverTopTabs from './src/StacksOverTopTabs';
import StackWithCustomHeaderBackImage from './src/StackWithCustomHeaderBackImage';
import StackWithHeaderPreset from './src/StackWithHeaderPreset';
import StackWithTranslucentHeader from './src/StackWithTranslucentHeader';
import SwitchWithStacks from './src/SwitchWithStacks';
import TabsInDrawer from './src/TabsInDrawer';
import DragLimitedToModal from './src/DragLimitedToModal';
import EventsStack from './src/EventsStack';
import FullScreen from './src/FullScreen';
import GestureInteraction from './src/GestureInteraction';
import {
  HeaderBackgroundDefault,
  HeaderBackgroundFade,
} from './src/HeaderBackgrounds';
import HeaderPreset from './src/HeaderPreset';
import IconTabs from './src/IconTabs';
import ImageStack from './src/ImageStack';
import ImmediateTransition from './src/ImmediateTransition';
import LifecycleInteraction from './src/LifecycleInteraction';
import MaterialTopTabs from './src/MaterialTopTabs';
import ModalPresentation from './src/ModalPresentation';
import ParallaxDrawer from './src/ParallaxDrawer';
import PerScreenTransitions from './src/PerScreenTransitions';
import RevealStack from './src/RevealStack';
import RTLDrawer from './src/RTLDrawer';
import ShiftingTabs from './src/ShiftingTabs';
import { SimpleDrawer, SimpleDrawerUnmountInactive } from './src/SimpleDrawer';
import StackAnimationConsumerStack from './src/StackAnimationConsumerStack';
import StackWithDrawer from './src/StackWithDrawer';
import StyledDrawer from './src/StyledDrawer';
import StackWithInput from './src/StackWithInput';
import TransparentStack from './src/TransparentStack';

const ExampleInfo = {
  SimpleStack: {
    name: 'Simple Stack',
    screen: SimpleStack,
  },
  BottomTabs: {
    name: 'Bottom Tabs Example',
    screen: BottomTabs,
  },
  ModalStack: {
    name:
      Platform.OS === 'ios'
        ? 'Modal Stack Example'
        : 'Stack with showing/hiding Header',
    screen: ModalStack,
  },
  StackWithCustomHeaderBackImage: {
    name: 'Stack with custom header back image',
    screen: StackWithCustomHeaderBackImage,
  },
  StackWithHeaderPreset: {
    name: 'UIKit-style Header Transitions',
    screen: StackWithHeaderPreset,
  },
  StackWithTranslucentHeader: {
    name: 'Translucent Header',
    screen: StackWithTranslucentHeader,
  },
  StacksInTabs: {
    name: 'Stacks in Tabs',
    screen: StacksInTabs,
  },
  StacksOverTabs: {
    name: 'Stacks over Tabs',
    screen: StacksOverTabs,
  },
  StacksOverTopTabs: {
    name: 'Stacks with non-standard header height',
    screen: StacksOverTopTabs,
  },
  StacksAndKeys: {
    name: 'Link in Stack with keys',
    screen: StacksAndKeys,
  },
  SwitchWithStacks: {
    name: 'Switch between routes',
    screen: SwitchWithStacks,
  },
  TabsInDrawer: {
    name: 'Drawer + Tabs Example',
    screen: TabsInDrawer,
  },
  Drawer: {
    name: 'Drawer Example',
    screen: Drawer,
  },
  AnimatedSwitch: {
    name: 'AnimatedSwitch Example',
    screen: AnimatedSwitch,
  },
  CustomTabUI: {
    name: 'Additional views around Tab navigator',
    screen: CustomTabUI,
  },
  CustomTabs: {
    name: 'Custom Tabs with router',
    screen: CustomTabs,
  },
  LinkStack: {
    name: 'Deep link in Stack',
    screen: SimpleStack,
    path: 'people/Jordan',
  },
  DragLimitedToModal: {
    name: 'Drag limited to modal',
    screen: DragLimitedToModal,
  },
  EventsStack: { name: 'Events Stack', screen: EventsStack },
  FullScreen: { name: 'Fullscreen Stack', screen: FullScreen },
  GestureInteraction: {
    name: 'Gesture interaction',
    screen: GestureInteraction,
  },
  HeaderBackgroundDefault: {
    name: 'Default preset for header background',
    screen: HeaderBackgroundDefault,
  },
  HeaderBackgroundFade: {
    name: 'Fade preset for header background',
    screen: HeaderBackgroundFade,
  },
  HeaderPreset: {
    name: 'Header presets',
    screen: HeaderPreset,
  },
  IconTabs: { name: 'Tabs with icons', screen: IconTabs },
  ImageStack: {
    name: 'Stack with images',
    screen: ImageStack,
  },
  ImmediateTransition: {
    name: 'Immediate transition',
    screen: ImmediateTransition,
  },
  LifecycleInteraction: {
    name: 'Lifecycle interaction',
    screen: LifecycleInteraction,
  },
  MaterialTopTabs: {
    name: 'Material top tabs',
    screen: MaterialTopTabs,
  },
  ModalPresentation: {
    name: 'Modal presentation Stack',
    screen: ModalPresentation,
  },
  ParallaxDrawer: {
    name: 'Parallax Drawer',
    screen: ParallaxDrawer,
  },
  PerScreenTransitions: {
    name: 'Per screen transitions',
    screen: PerScreenTransitions,
  },
  RevealStack: {
    name: 'Reveal animation Stack',
    screen: RevealStack,
  },
  RTLDrawer: { name: 'RTL Srawer', screen: RTLDrawer },
  ShiftingTabs: {
    name: 'Shifting tabs',
    screen: ShiftingTabs,
  },
  SimpleDrawer: {
    name: 'Simple drawer',
    screen: SimpleDrawer,
  },
  SimpleDrawerUnmountInactive: {
    name: 'Simple drawer (unmountInactive)',
    screen: SimpleDrawerUnmountInactive,
  },
  StackAnimationConsumerStack: {
    name: 'Stack animation consumer',
    screen: StackAnimationConsumerStack,
  },
  StackWithDrawer: {
    name: 'Stack with drawer',
    screen: StackWithDrawer,
  },
  StyledDrawer: {
    name: 'Styled drawer',
    screen: StyledDrawer,
  },
  StackWithInput: {
    name: 'Stack with input',
    screen: StackWithInput,
  },
  TransparentStack: {
    name: 'Transparent stack',
    screen: TransparentStack,
  },
};

interface State {
  scrollY: Animated.Value;
}

class MainScreen extends React.Component<any, State> {
  // eslint-disable-next-line react/sort-comp
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
                {(Object.keys(ExampleInfo) as (keyof typeof ExampleInfo)[]).map(
                  routeName => (
                    <RectButton
                      key={routeName}
                      underlayColor="#ccc"
                      activeOpacity={0.3}
                      onPress={() => {
                        const route = ExampleInfo[routeName];
                        // @ts-ignore
                        if (route.screen || route.path || route.params) {
                          // @ts-ignore
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
                      </View>
                    </RectButton>
                  )
                )}
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
      ...ExampleInfo,
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

export default function App() {
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
}

registerRootComponent(App);

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
  item: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    padding: 16,
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
  },
});
