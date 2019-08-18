import * as React from 'react';
import { ScrollView, AsyncStorage, YellowBox } from 'react-native';
import { Appbar, List } from 'react-native-paper';
import { Asset } from 'expo-asset';
import {
  NavigationContainer,
  InitialState,
  NavigationHelpers,
  ParamListBase,
} from '@navigation-ex/core';
import { useNativeIntegration } from '@navigation-ex/native';
import {
  createDrawerNavigator,
  DrawerNavigationProp,
} from '@navigation-ex/drawer';
import {
  createStackNavigator,
  Assets as StackAssets,
  StackNavigationProp,
} from '@navigation-ex/stack';

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
  const containerRef = React.useRef<NavigationHelpers<ParamListBase>>(null);

  useNativeIntegration(containerRef);

  const [isReady, setIsReady] = React.useState(false);
  const [initialState, setInitialState] = React.useState<
    InitialState | undefined
  >();

  React.useEffect(() => {
    AsyncStorage.getItem(PERSISTENCE_KEY).then(
      data => {
        try {
          const result = JSON.parse(data || '');

          if (result) {
            setInitialState(result);
          }
        } finally {
          setIsReady(true);
        }
      },
      () => setIsReady(true)
    );
  }, []);

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
