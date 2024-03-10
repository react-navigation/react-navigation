import type { PathConfigMap } from '@react-navigation/native';
import {
  createStackNavigator,
  type StackScreenProps,
} from '@react-navigation/stack';
import * as React from 'react';
import { ScrollView } from 'react-native';

import { Divider } from '../Shared/Divider';
import { ListItem } from '../Shared/LIstItem';
import { AutoWidthTabBar } from './TabView/AutoWidthTabBar';
import { Coverflow } from './TabView/Coverflow';
import { CustomIndicator } from './TabView/CustomIndicator';
import { CustomTabBar } from './TabView/CustomTabBar';
import { ScrollableTabBar } from './TabView/ScrollableTabBar';
import { TabBarIcon } from './TabView/TabBarIcon';

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

const linking: PathConfigMap<TabViewStackParams> = {
  ExampleList: '',
  ...EXAMPLE_SCREEN_NAMES.reduce(
    (acc, name) => ({
      ...acc,
      [name]: name
        .replace(/([A-Z]+)/g, '-$1')
        .replace(/^-/, '')
        .toLowerCase(),
    }),
    {}
  ),
};

const TabViewStack = createStackNavigator<TabViewStackParams>();

const ExampleListScreen = ({
  navigation,
}: StackScreenProps<TabViewStackParams, 'ExampleList'>) => {
  return (
    <ScrollView>
      {EXAMPLE_SCREEN_NAMES.map((name) => (
        <React.Fragment key={name}>
          <ListItem
            testID={name}
            title={EXAMPLE_SCREENS[name].options.title}
            onPress={() => {
              navigation.navigate(name);
            }}
          />
          <Divider />
        </React.Fragment>
      ))}
    </ScrollView>
  );
};

export function TabView() {
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

TabView.title = 'Tab View';
TabView.linking = linking;
