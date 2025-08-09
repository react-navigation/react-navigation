import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  useLogger,
  useReduxDevToolsExtension,
} from '@react-navigation/devtools';
import {
  createDrawerNavigator,
  type DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
  type DrawerScreenProps,
} from '@react-navigation/drawer';
import { Text } from '@react-navigation/elements';
import {
  type CompositeScreenProps,
  DarkTheme,
  DefaultTheme,
  type InitialState,
  type LinkingOptions,
  NavigationContainer,
  type Theme,
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
  Appearance,
  I18nManager,
  Linking,
  Platform,
  PlatformColor,
  ScrollView,
  Switch,
  useWindowDimensions,
} from 'react-native';
import { SystemBars } from 'react-native-edge-to-edge';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  type RootDrawerParamList,
  type RootStackParamList,
  SCREENS,
} from './screens';
import { NotFound } from './Screens/NotFound';
import { Divider } from './Shared/Divider';
import { ErrorBoundary } from './Shared/ErrorBoundary';
import { ListItem } from './Shared/LIstItem';
import { SegmentedPicker } from './Shared/SegmentedPicker';

const Drawer = createDrawerNavigator<RootDrawerParamList>();
const Stack = createStackNavigator<RootStackParamList>();

const NAVIGATION_PERSISTENCE_KEY = 'NAVIGATION_STATE';
const THEME_PERSISTENCE_KEY = 'THEME_TYPE';
const DIRECTION_PERSISTENCE_KEY = 'DIRECTION';

const SCREEN_NAMES = Object.keys(SCREENS) as (keyof typeof SCREENS)[];

const linking: LinkingOptions<RootStackParamList> = {
  // To test deep linking on, run the following in the Terminal:
  // Android: npx uri-scheme@latest open "rne://simple-stack" --android
  // iOS: npx uri-scheme@latest open "rne://simple-stack" --ios
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

const WEB_COLORS = {
  primary: '#5850ec',
  background: '#f3f4f6',
  card: '#ffffff',
  text: '#1f2937',
  border: '#e5e7eb',
  notification: '#f05252',
} satisfies Theme['colors'];

const PlatformTheme: Theme = {
  ...DefaultTheme,
  colors: Platform.select<() => Theme['colors']>({
    ios: () => ({
      primary: PlatformColor('systemRed'),
      background: PlatformColor('systemGroupedBackground'),
      card: PlatformColor('tertiarySystemBackground'),
      text: PlatformColor('label'),
      border: PlatformColor('separator'),
      notification: PlatformColor('systemRed'),
    }),
    android: () => ({
      primary: PlatformColor('@android:color/system_primary_light'),
      background: PlatformColor(
        '@android:color/system_surface_container_light'
      ),
      card: PlatformColor('@android:color/system_background_light'),
      text: PlatformColor('@android:color/system_on_surface_light'),
      border: PlatformColor('@android:color/system_outline_variant_light'),
      notification: PlatformColor('@android:color/holo_red_light'),
    }),
    web: () => ({
      primary: 'var(--color-primary)',
      background: 'var(--color-background)',
      card: 'var(--color-card)',
      text: 'var(--color-text)',
      border: 'var(--color-border)',
      notification: 'var(--color-notification)',
    }),
    default: () => DefaultTheme.colors,
  })(),
};

let previousDirection = I18nManager.getConstants().isRTL ? 'rtl' : 'ltr';

if (Platform.OS === 'web') {
  if (typeof document !== 'undefined' && document.documentElement) {
    document
      .getElementById('root')
      ?.setAttribute('style', 'height: 100vh; overflow: auto;');
  }

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
  const [themeName, setThemeName] = React.useState<'light' | 'dark' | 'custom'>(
    'custom'
  );

  const [isReady, setIsReady] = React.useState(Platform.OS === 'web');
  const [initialState, setInitialState] = React.useState<
    InitialState | undefined
  >();

  const [isRTL, setIsRTL] = React.useState(previousDirection === 'rtl');

  React.useEffect(() => {
    const restoreState = async () => {
      try {
        const initialUrl = await Linking.getInitialURL();

        if (Platform.OS !== 'web' && initialUrl === null) {
          const savedState = await AsyncStorage.getItem(
            NAVIGATION_PERSISTENCE_KEY
          );

          const state = savedState ? JSON.parse(savedState) : undefined;

          if (state !== undefined) {
            setInitialState(state);
          }
        }
      } finally {
        try {
          const savedThemeName = await AsyncStorage.getItem(
            THEME_PERSISTENCE_KEY
          );

          setThemeName(
            savedThemeName === 'dark'
              ? 'dark'
              : savedThemeName === 'light'
                ? 'light'
                : 'custom'
          );
        } catch (e) {
          // Ignore
        }

        try {
          const direction = await AsyncStorage.getItem(
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
    if (!isReady) {
      return;
    }

    AsyncStorage.setItem(THEME_PERSISTENCE_KEY, themeName);

    const colorScheme = themeName === 'dark' ? 'dark' : 'light';

    if (Platform.OS === 'web') {
      document.documentElement.style.colorScheme = colorScheme;
    } else {
      Appearance.setColorScheme(colorScheme);
    }
  }, [isReady, themeName]);

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

  useLogger(navigationRef);
  useReduxDevToolsExtension(navigationRef);

  if (!isReady) {
    return null;
  }

  const isLargeScreen = dimensions.width >= 1024;
  const theme =
    themeName === 'dark'
      ? DarkTheme
      : themeName === 'light'
        ? DefaultTheme
        : PlatformTheme;

  return (
    <Providers>
      <SystemBars style="auto" />
      {Platform.OS === 'web' ? (
        <style>
          {`:root { ${Object.entries(WEB_COLORS)
            .map(([key, value]) => `--color-${key}: ${value};`)
            .join('')} }`}
        </style>
      ) : null}
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
                drawerContent={(props) => <CustomDrawerContent {...props} />}
                screenOptions={{
                  drawerType: isLargeScreen ? 'permanent' : undefined,
                }}
              >
                <Drawer.Screen
                  name="Examples"
                  options={{
                    title: 'Examples',
                    headerLeft: isLargeScreen ? () => null : undefined,
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
                        <ListItem title="Right to left">
                          <Switch
                            value={isRTL}
                            onValueChange={setIsRTL}
                            disabled={
                              // Set expo.extra.forcesRTL: true in app.json to enable RTL in Expo Go
                              Platform.OS !== 'web'
                            }
                            trackColor={{ true: theme.colors.primary }}
                          />
                        </ListItem>
                        <Divider />
                        <ListItem title="Theme">
                          <SegmentedPicker
                            choices={[
                              { label: 'Custom', value: 'custom' },
                              { label: 'Light', value: 'light' },
                              { label: 'Dark', value: 'dark' },
                            ]}
                            value={themeName}
                            onValueChange={setThemeName}
                          />
                        </ListItem>
                        <Divider />
                        {SCREEN_NAMES.map((name) => (
                          <React.Fragment key={name}>
                            <ListItem
                              title={SCREENS[name].title}
                              onPress={() => {
                                // @ts-expect-error TS has a limit of 24 items https://github.com/microsoft/TypeScript/issues/40803
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
          {SCREEN_NAMES.map((name) => {
            const screen = SCREENS[name];

            return (
              <Stack.Screen
                key={name}
                name={name}
                component={screen}
                options={{
                  headerShown: false,
                  title: screen.title,
                  ...('options' in screen ? screen.options : null),
                }}
              />
            );
          })}
        </Stack.Navigator>
      </NavigationContainer>
    </Providers>
  );
}

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <ErrorBoundary
      onError={() => {
        AsyncStorage.removeItem(NAVIGATION_PERSISTENCE_KEY);
      }}
    >
      <ActionSheetProvider>
        <>{children}</>
      </ActionSheetProvider>
    </ErrorBoundary>
  );
};

const DRAWER_ITEMS = [
  {
    icon: 'message-reply',
    label: 'Chat',
  },
  {
    icon: 'contacts',
    label: 'Contacts',
  },
  {
    icon: 'image-album',
    label: 'Albums',
  },
] as const;

const CustomDrawerContent = (props: DrawerContentComponentProps) => {
  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
      {DRAWER_ITEMS.map((item) => (
        <DrawerItem
          key={item.label}
          label={item.label}
          icon={({ color, size }) => (
            <MaterialCommunityIcons
              name={item.icon}
              color={color}
              size={size}
            />
          )}
          onPress={() => {
            // Do nothing for now
          }}
        />
      ))}
    </DrawerContentScrollView>
  );
};
