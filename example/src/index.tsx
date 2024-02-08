import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useReduxDevToolsExtension } from '@react-navigation/devtools';
import {
  createDrawerNavigator,
  type DrawerScreenProps,
} from '@react-navigation/drawer';
import {
  type CompositeScreenProps,
  DarkTheme,
  DefaultTheme,
  type InitialState,
  NavigationContainer,
  useNavigationContainerRef,
} from '@react-navigation/native';
import {
  createStackNavigator,
  HeaderStyleInterpolators,
  type StackScreenProps,
} from '@react-navigation/stack';
import { createURL } from 'expo-linking';
import * as SplashScreen from 'expo-splash-screen';
import { reloadAsync } from 'expo-updates';
import * as React from 'react';
import {
  I18nManager,
  Linking,
  Platform,
  ScrollView,
  StatusBar,
  Text,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { LinkingOptions } from '../../packages/native/src/types';
import {
  type RootDrawerParamList,
  type RootStackParamList,
  SCREENS,
} from './screens';
import { NotFound } from './Screens/NotFound';
import { Divider } from './Shared/Divider';
import { ListItem } from './Shared/LIstItem';
import { SettingsItem } from './Shared/SettingsItem';

const Drawer = createDrawerNavigator<RootDrawerParamList>();
const Stack = createStackNavigator<RootStackParamList>();

const NAVIGATION_PERSISTENCE_KEY = 'NAVIGATION_STATE';
const THEME_PERSISTENCE_KEY = 'THEME_TYPE';
const DIRECTION_PERSISTENCE_KEY = 'DIRECTION';

const SCREEN_NAMES = Object.keys(SCREENS) as (keyof typeof SCREENS)[];

const linking: LinkingOptions<RootStackParamList> = {
  // To test deep linking on, run the following in the Terminal:
  // Android: adb shell am start -a android.intent.action.VIEW -d "exp://127.0.0.1:19000/--/simple-stack"
  // iOS: xcrun simctl openurl booted exp://127.0.0.1:19000/--/simple-stack
  // Android (bare): adb shell am start -a android.intent.action.VIEW -d "rne://127.0.0.1:19000/--/simple-stack"
  // iOS (bare): xcrun simctl openurl booted rne://127.0.0.1:19000/--/simple-stack
  // The first segment of the link is the the scheme + host (returned by `Linking.makeUrl`)
  prefixes: [createURL('/')],
  config: {
    initialRouteName: 'Home',
    screens: {
      Home: {
        screens: {
          Examples: '',
        },
      },
      NotFound: '*',
      ...Object.fromEntries(
        Object.entries(SCREENS).map(([name, { linking }]) => {
          // Convert screen names such as SimpleStack to kebab case (simple-stack)
          const path = name
            .replace(/([A-Z]+)/g, '-$1')
            .replace(/^-/, '')
            .toLowerCase();

          return [
            name,
            {
              path,
              screens: linking,
            },
          ];
        })
      ),
    },
  },
};

let previousDirection = I18nManager.getConstants().isRTL ? 'rtl' : 'ltr';

if (Platform.OS === 'web') {
  if (
    typeof localStorage !== 'undefined' &&
    typeof document !== 'undefined' &&
    document.documentElement
  ) {
    const direction = localStorage.getItem(DIRECTION_PERSISTENCE_KEY);

    if (direction !== null) {
      previousDirection = direction;
      document.documentElement.dir = direction;
    }
  }
}

export function App() {
  const [theme, setTheme] = React.useState(DefaultTheme);

  const [isReady, setIsReady] = React.useState(Platform.OS === 'web');
  const [initialState, setInitialState] = React.useState<
    InitialState | undefined
  >();

  const [isRTL, setIsRTL] = React.useState(previousDirection === 'rtl');

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

        try {
          const direction = await AsyncStorage?.getItem(
            DIRECTION_PERSISTENCE_KEY
          );

          setIsRTL(direction === 'rtl');
        } catch (e) {
          // Ignore
        }

        setIsReady(true);
      }
    };

    restoreState();
  }, []);

  React.useEffect(() => {
    AsyncStorage.setItem(THEME_PERSISTENCE_KEY, theme.dark ? 'dark' : 'light');
  }, [theme.dark]);

  React.useEffect(() => {
    const direction = isRTL ? 'rtl' : 'ltr';

    AsyncStorage.setItem(DIRECTION_PERSISTENCE_KEY, direction);

    if (Platform.OS === 'web') {
      document.documentElement.dir = direction;
      localStorage.setItem(DIRECTION_PERSISTENCE_KEY, direction);
    }

    if (isRTL !== I18nManager.getConstants().isRTL) {
      I18nManager.forceRTL(isRTL);

      if (Platform.OS !== 'web') {
        reloadAsync();
      }
    }
  }, [isRTL]);

  const dimensions = useWindowDimensions();

  const navigationRef = useNavigationContainerRef();

  useReduxDevToolsExtension(navigationRef);

  if (!isReady) {
    return null;
  }

  const isLargeScreen = dimensions.width >= 1024;

  return (
    <Providers>
      {Platform.OS === 'android' && (
        <StatusBar
          translucent
          barStyle={theme.dark ? 'light-content' : 'dark-content'}
          backgroundColor="rgba(0, 0, 0, 0.24)"
        />
      )}
      <NavigationContainer
        ref={navigationRef}
        initialState={initialState}
        onReady={() => {
          SplashScreen.hideAsync();
        }}
        onStateChange={(state) =>
          AsyncStorage.setItem(
            NAVIGATION_PERSISTENCE_KEY,
            JSON.stringify(state)
          )
        }
        theme={theme}
        direction={isRTL ? 'rtl' : 'ltr'}
        linking={linking}
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
                          value={isRTL}
                          onValueChange={() => setIsRTL((rtl) => !rtl)}
                        />
                        <Divider />
                        <SettingsItem
                          label="Dark theme"
                          value={theme.dark}
                          onValueChange={() =>
                            setTheme((t) => (t.dark ? DefaultTheme : DarkTheme))
                          }
                        />
                        {SCREEN_NAMES.map((name) => (
                          <React.Fragment key={name}>
                            <ListItem
                              title={SCREENS[name].title}
                              onPress={() => {
                                navigation.navigate(name);
                              }}
                            />

                            <Divider />
                          </React.Fragment>
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
    </Providers>
  );
}

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <ActionSheetProvider>
      <>{children}</>
    </ActionSheetProvider>
  );
};
