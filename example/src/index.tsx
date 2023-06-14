import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  useFlipper,
  useReduxDevToolsExtension,
} from '@react-navigation/devtools';
import {
  createDrawerNavigator,
  DrawerScreenProps,
} from '@react-navigation/drawer';
import {
  CompositeScreenProps,
  DarkTheme,
  DefaultTheme,
  InitialState,
  NavigationContainer,
  PathConfigMap,
  useNavigationContainerRef,
} from '@react-navigation/native';
import {
  createStackNavigator,
  HeaderStyleInterpolators,
  StackScreenProps,
} from '@react-navigation/stack';
import { createURL } from 'expo-linking';
import * as React from 'react';
import {
  I18nManager,
  Linking,
  LogBox,
  Platform,
  ScrollView,
  StatusBar,
  Text,
  useWindowDimensions,
} from 'react-native';
import {
  DarkTheme as PaperDarkTheme,
  DefaultTheme as PaperLightTheme,
  Divider,
  List,
  Provider as PaperProvider,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import { restartApp } from './Restart';
import { RootDrawerParamList, RootStackParamList, SCREENS } from './screens';
import NotFound from './Screens/NotFound';
import SettingsItem from './Shared/SettingsItem';

if (Platform.OS !== 'web') {
  LogBox.ignoreLogs(['Require cycle:']);
}

const Drawer = createDrawerNavigator<RootDrawerParamList>();
const Stack = createStackNavigator<RootStackParamList>();

const NAVIGATION_PERSISTENCE_KEY = 'NAVIGATION_STATE';
const THEME_PERSISTENCE_KEY = 'THEME_TYPE';

const SCREEN_NAMES = Object.keys(SCREENS) as (keyof typeof SCREENS)[];

export default function App() {
  const [theme, setTheme] = React.useState(DefaultTheme);

  const [isReady, setIsReady] = React.useState(Platform.OS === 'web');
  const [initialState, setInitialState] = React.useState<
    InitialState | undefined
  >();

  React.useEffect(() => {
    const restoreState = async () => {
      try {
        const initialUrl = await Linking.getInitialURL();

        if (Platform.OS !== 'web' || initialUrl === null) {
          const savedState = await AsyncStorage?.getItem(
            NAVIGATION_PERSISTENCE_KEY
          );

          const state = savedState ? JSON.parse(savedState) : undefined;

          if (state !== undefined) {
            setInitialState(state);
          }
        }
      } finally {
        try {
          const themeName = await AsyncStorage?.getItem(THEME_PERSISTENCE_KEY);

          setTheme(themeName === 'dark' ? DarkTheme : DefaultTheme);
        } catch (e) {
          // Ignore
        }

        setIsReady(true);
      }
    };

    restoreState();
  }, []);

  const paperTheme = React.useMemo(() => {
    const t = theme.dark ? PaperDarkTheme : PaperLightTheme;

    return {
      ...t,
      colors: {
        ...t.colors,
        ...theme.colors,
        surface: theme.colors.card,
        accent: theme.dark ? 'rgb(255, 55, 95)' : 'rgb(255, 45, 85)',
      },
    };
  }, [theme.colors, theme.dark]);

  const dimensions = useWindowDimensions();

  const navigationRef = useNavigationContainerRef();

  useReduxDevToolsExtension(navigationRef);
  useFlipper(navigationRef);

  if (!isReady) {
    return null;
  }

  const isLargeScreen = dimensions.width >= 1024;

  return (
    <PaperProvider theme={paperTheme}>
      <StatusBar
        translucent
        barStyle={theme.dark ? 'light-content' : 'dark-content'}
        backgroundColor="rgba(0, 0, 0, 0.24)"
      />
      <NavigationContainer
        ref={navigationRef}
        initialState={initialState}
        onStateChange={(state) =>
          AsyncStorage?.setItem(
            NAVIGATION_PERSISTENCE_KEY,
            JSON.stringify(state)
          )
        }
        theme={theme}
        linking={{
          // To test deep linking on, run the following in the Terminal:
          // Android: adb shell am start -a android.intent.action.VIEW -d "exp://127.0.0.1:19000/--/simple-stack"
          // iOS: xcrun simctl openurl booted exp://127.0.0.1:19000/--/simple-stack
          // Android (bare): adb shell am start -a android.intent.action.VIEW -d "rne://127.0.0.1:19000/--/simple-stack"
          // iOS (bare): xcrun simctl openurl booted rne://127.0.0.1:19000/--/simple-stack
          // The first segment of the link is the the scheme + host (returned by `Linking.makeUrl`)
          prefixes: [createURL('/')],
          config: {
            initialRouteName: 'Home',
            screens: SCREEN_NAMES.reduce<PathConfigMap<RootStackParamList>>(
              (acc, name) => {
                // Convert screen names such as SimpleStack to kebab case (simple-stack)
                const path = name
                  .replace(/([A-Z]+)/g, '-$1')
                  .replace(/^-/, '')
                  .toLowerCase();

                acc[name] = {
                  path,
                  screens: {
                    Article: {
                      path: 'article/:author?',
                      parse: {
                        author: (author: string) =>
                          author.charAt(0).toUpperCase() +
                          author.slice(1).replace(/-/g, ' '),
                      },
                      stringify: {
                        author: (author: string) =>
                          author.toLowerCase().replace(/\s/g, '-'),
                      },
                    },
                    Albums: 'music',
                    Chat: 'chat',
                    Contacts: 'people',
                    NewsFeed: 'feed',
                    Dialog: 'dialog',
                  },
                };

                return acc;
              },
              {
                Home: {
                  screens: {
                    Examples: '',
                  },
                },
                NotFound: '*',
              }
            ),
          },
        }}
        fallback={<Text>Loading…</Text>}
        documentTitle={{
          formatter: (options, route) =>
            `${options?.title ?? route?.name} - React Navigation Example`,
        }}
      >
        <Stack.Navigator
          screenOptions={{
            headerStyleInterpolator: HeaderStyleInterpolators.forUIKit,
          }}
        >
          <Stack.Screen
            name="Home"
            options={{
              headerShown: false,
            }}
          >
            {() => (
              <Drawer.Navigator
                screenOptions={{
                  drawerType: isLargeScreen ? 'permanent' : undefined,
                  overlayAccessibilityLabel: 'Close drawer',
                }}
              >
                <Drawer.Screen
                  name="Examples"
                  options={{
                    title: 'Examples',
                    drawerIcon: ({ size, color }) => (
                      <MaterialIcons size={size} color={color} name="folder" />
                    ),
                  }}
                >
                  {({
                    navigation,
                  }: CompositeScreenProps<
                    DrawerScreenProps<RootDrawerParamList, 'Examples'>,
                    StackScreenProps<RootStackParamList>
                  >) => (
                    <ScrollView
                      style={{ backgroundColor: theme.colors.background }}
                    >
                      <SafeAreaView edges={['right', 'bottom', 'left']}>
                        <SettingsItem
                          label="Right to left"
                          value={I18nManager.getConstants().isRTL}
                          onValueChange={() => {
                            I18nManager.forceRTL(
                              !I18nManager.getConstants().isRTL
                            );
                            restartApp();
                          }}
                        />
                        <Divider />
                        <SettingsItem
                          label="Dark theme"
                          value={theme.dark}
                          onValueChange={() => {
                            AsyncStorage?.setItem(
                              THEME_PERSISTENCE_KEY,
                              theme.dark ? 'light' : 'dark'
                            );

                            setTheme((t) =>
                              t.dark ? DefaultTheme : DarkTheme
                            );
                          }}
                        />
                        <Divider />
                        {SCREEN_NAMES.map((name) => (
                          <List.Item
                            key={name}
                            testID={name}
                            title={SCREENS[name].title}
                            onPress={() => {
                              navigation.navigate(name);
                            }}
                          />
                        ))}
                      </SafeAreaView>
                    </ScrollView>
                  )}
                </Drawer.Screen>
              </Drawer.Navigator>
            )}
          </Stack.Screen>
          <Stack.Screen
            name="NotFound"
            component={NotFound}
            options={{ title: 'Oops!' }}
          />
          {SCREEN_NAMES.map((name) => (
            <Stack.Screen
              key={name}
              name={name}
              getComponent={() => SCREENS[name].component}
              options={{ title: SCREENS[name].title }}
            />
          ))}
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}
