import * as React from 'react';
import { ScrollView, AsyncStorage, YellowBox } from 'react-native';
import { Linking } from 'expo';
import { Appbar, List } from 'react-native-paper';
import { Asset } from 'expo-asset';
import {
  NavigationContainer,
  InitialState,
  getStateFromPath,
  NavigationContainerRef,
} from '@react-navigation/core';
import { useBackButton, useLinking } from '@react-navigation/native';
import {
  createDrawerNavigator,
  DrawerNavigationProp,
} from '@react-navigation/drawer';
import {
  createStackNavigator,
  Assets as StackAssets,
  StackNavigationProp,
} from '@react-navigation/stack';

import SimpleStackScreen from './Screens/SimpleStack';
import BottomTabsScreen from './Screens/BottomTabs';
import MaterialTopTabsScreen from './Screens/MaterialTopTabs';
import MaterialBottomTabs from './Screens/MaterialBottomTabs';

YellowBox.ignoreWarnings(['Require cycle:', 'Warning: Async Storage']);

type RootDrawerParamList = {
  root: undefined;
};

type RootStackParamList = {
  home: undefined;
} & {
  [P in keyof typeof SCREENS]: undefined;
};

const SCREENS = {
  'simple-stack': { title: 'Simple Stack', component: SimpleStackScreen },
  'bottom-tabs': { title: 'Bottom Tabs', component: BottomTabsScreen },
  'material-top-tabs': {
    title: 'Material Top Tabs',
    component: MaterialTopTabsScreen,
  },
  'material-bottom-tabs': {
    title: 'Material Bottom Tabs',
    component: MaterialBottomTabs,
  },
};

const Drawer = createDrawerNavigator<RootDrawerParamList>();
const Stack = createStackNavigator<RootStackParamList>();

const PERSISTENCE_KEY = 'NAVIGATION_STATE';

Asset.loadAsync(StackAssets);

export default function App() {
  const containerRef = React.useRef<NavigationContainerRef>();

  useBackButton(containerRef);

  // To test deep linking on, run the following in the Terminal:
  // Android: adb shell am start -a android.intent.action.VIEW -d "exp://127.0.0.1:19000/--/simple-stack"
  // iOS: xcrun simctl openurl booted exp://127.0.0.1:19000/--/simple-stack
  // The first segment of the link is the the scheme + host (returned by `Linking.makeUrl`)
  const { getInitialState } = useLinking(containerRef, {
    prefixes: [Linking.makeUrl('/')],
    getStateFromPath: path => {
      const state = getStateFromPath(path);

      return {
        routes: [
          {
            name: 'root',
            state: {
              ...state,
              routes: [{ name: 'home' }, ...(state ? state.routes : [])],
            },
          },
        ],
      };
    },
  });

  const [isReady, setIsReady] = React.useState(false);
  const [initialState, setInitialState] = React.useState<
    InitialState | undefined
  >();

  React.useEffect(() => {
    const restoreState = async () => {
      try {
        let state = await getInitialState();

        if (state === undefined) {
          const savedState = await AsyncStorage.getItem(PERSISTENCE_KEY);
          state = savedState ? JSON.parse(savedState) : undefined;
        }

        if (state !== undefined) {
          setInitialState(state);
        }
      } finally {
        setIsReady(true);
      }
    };

    restoreState();
  }, [getInitialState]);

  if (!isReady) {
    return null;
  }

  return (
    <NavigationContainer
      ref={containerRef}
      initialState={initialState}
      onStateChange={state =>
        AsyncStorage.setItem(PERSISTENCE_KEY, JSON.stringify(state))
      }
    >
      <Drawer.Navigator>
        <Drawer.Screen name="root" options={{ title: 'Examples' }}>
          {({
            navigation,
          }: {
            navigation: DrawerNavigationProp<RootDrawerParamList>;
          }) => (
            <Stack.Navigator>
              <Stack.Screen
                name="home"
                options={{
                  title: 'Examples',
                  headerLeft: () => (
                    <Appbar.Action
                      icon="menu"
                      onPress={() => navigation.toggleDrawer()}
                    />
                  ),
                }}
              >
                {({
                  navigation,
                }: {
                  navigation: StackNavigationProp<RootStackParamList>;
                }) => (
                  <ScrollView>
                    {(Object.keys(SCREENS) as Array<keyof typeof SCREENS>).map(
                      name => (
                        <List.Item
                          key={name}
                          title={SCREENS[name].title}
                          onPress={() => navigation.push(name)}
                        />
                      )
                    )}
                  </ScrollView>
                )}
              </Stack.Screen>
              {(Object.keys(SCREENS) as Array<keyof typeof SCREENS>).map(
                name => (
                  <Stack.Screen
                    key={name}
                    name={name}
                    component={SCREENS[name].component}
                    options={{ title: SCREENS[name].title }}
                  />
                )
              )}
            </Stack.Navigator>
          )}
        </Drawer.Screen>
      </Drawer.Navigator>
    </NavigationContainer>
  );
}
