import type { ParamListBase } from '@react-navigation/native';
import {
  createStackNavigator,
  StackScreenProps,
} from '@react-navigation/stack';
import * as React from 'react';
import { ScrollView } from 'react-native';
import { List } from 'react-native-paper';

import AutoWidthTabBar from './TabView/AutoWidthTabBar';
import Coverflow from './TabView/Coverflow';
import CustomIndicator from './TabView/CustomIndicator';
import CustomTabBar from './TabView/CustomTabBar';
import ScrollableTabBar from './TabView/ScrollableTabBar';
import TabBarIcon from './TabView/TabBarIcon';

const EXAMPLE_SCREENS = {
  ScrollableTabBar,
  AutoWidthTabBar,
  TabBarIcon,
  CustomIndicator,
  CustomTabBar,
  Coverflow,
} as const;

const EXAMPLE_SCREEN_NAMES = Object.keys(
  EXAMPLE_SCREENS
) as (keyof typeof EXAMPLE_SCREENS)[];

export type TabViewStackParams = {
  [Key in keyof typeof EXAMPLE_SCREENS]: undefined;
} & {
  ExampleList: undefined;
};

const TabViewStack = createStackNavigator<TabViewStackParams>();

const ExampleListScreen = ({
  navigation,
}: StackScreenProps<TabViewStackParams, 'ExampleList'>) => {
  return (
    <ScrollView>
      {EXAMPLE_SCREEN_NAMES.map((name) => (
        <List.Item
          key={name}
          testID={name}
          title={EXAMPLE_SCREENS[name].options.title}
          onPress={() => {
            navigation.navigate(name);
          }}
        />
      ))}
    </ScrollView>
  );
};

export default function TabViewStackScreen({
  navigation,
}: StackScreenProps<ParamListBase>) {
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  return (
    <TabViewStack.Navigator
      screenOptions={{ headerMode: 'screen', cardStyle: { flex: 1 } }}
    >
      <TabViewStack.Screen
        name="ExampleList"
        component={ExampleListScreen}
        options={{
          title: 'TabView Examples',
        }}
      />
      {EXAMPLE_SCREEN_NAMES.map((name) => {
        return (
          <TabViewStack.Screen
            key={name}
            name={name}
            component={EXAMPLE_SCREENS[name]}
            options={EXAMPLE_SCREENS[name].options}
          />
        );
      })}
    </TabViewStack.Navigator>
  );
}
