import { useNavigation } from '@react-navigation/native';
import {
  createStackNavigator,
  createStackScreen,
} from '@react-navigation/stack';
import * as React from 'react';
import { ScrollView } from 'react-native';

import { Divider } from '../Shared/Divider';
import { ListItem } from '../Shared/LIstItem';
import { fromEntries } from '../utilities';
import { AutoWidthTabBar } from './TabView/AutoWidthTabBar';
import { Coverflow } from './TabView/Coverflow';
import { CustomIndicator } from './TabView/CustomIndicator';
import { CustomTabBar } from './TabView/CustomTabBar';
import { ScrollableTabBar } from './TabView/ScrollableTabBar';
import { ScrollAdapter } from './TabView/ScrollAdapter';
import { TabBarIcon } from './TabView/TabBarIcon';

const EXAMPLE_SCREENS = {
  ScrollableTabBar,
  AutoWidthTabBar,
  TabBarIcon,
  CustomIndicator,
  CustomTabBar,
  Coverflow,
  ScrollAdapter,
} as const;

const EXAMPLE_SCREEN_NAMES = Object.keys(
  EXAMPLE_SCREENS
) as (keyof typeof EXAMPLE_SCREENS)[];

const ExampleListScreen = () => {
  const navigation = useNavigation('ExampleList');

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

const TabViewStackNavigator = createStackNavigator({
  screenOptions: { headerMode: 'screen', cardStyle: { flex: 1 } },
  screens: {
    ExampleList: createStackScreen({
      screen: ExampleListScreen,
      options: { title: 'TabView Examples' },
      linking: '',
    }),
    ...fromEntries(
      EXAMPLE_SCREEN_NAMES.map((name) => [
        name,
        createStackScreen({
          screen: EXAMPLE_SCREENS[name],
          options: EXAMPLE_SCREENS[name].options,
        }),
      ])
    ),
  },
});

export const LibrariesTabView = {
  screen: TabViewStackNavigator,
  title: 'Libraries - Tab View',
};
