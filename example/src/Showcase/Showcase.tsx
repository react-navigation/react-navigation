import {
  type StaticScreenConfigScreen,
  useNavigation,
} from '@react-navigation/native';
import {
  createNativeStackNavigator,
  createNativeStackScreen,
} from '@react-navigation/native-stack';
import * as React from 'react';
import { ScrollView } from 'react-native';

import { Divider } from '../Shared/Divider';
import { ListGroupItem } from '../Shared/ListGroupItem';
import { ListItem } from '../Shared/LIstItem';
import { fromEntries } from '../utilities';
import { MaterialTopTabsShowcase } from './MaterialTopTabsShowcase';
import { NativeBottomTabsShowcase } from './NativeBottomTabsShowcase';
import { NativeStackShowcase } from './NativeStackShowcase';

const EXAMPLE_SCREENS = [
  {
    name: 'NativeStackShowcase',
    title: 'Native Stack',
    screen: NativeStackShowcase,
  },
  {
    name: 'NativeBottomTabsShowcase',
    title: 'Native Bottom Tabs',
    screen: NativeBottomTabsShowcase,
  },
  {
    name: 'MaterialTopTabsShowcase',
    title: 'Material Top Tabs',
    screen: MaterialTopTabsShowcase,
  },
] as const satisfies {
  name: string;
  title: string;
  screen: StaticScreenConfigScreen;
}[];

const ExampleListScreen = () => {
  const navigation = useNavigation('ExampleList');

  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic">
      <ListGroupItem>
        {EXAMPLE_SCREENS.map((screen) => (
          <React.Fragment key={screen.name}>
            <ListItem
              testID={screen.name}
              title={screen.title}
              onPress={() => {
                navigation.navigate(screen.name);
              }}
            />
            <Divider />
          </React.Fragment>
        ))}
      </ListGroupItem>
    </ScrollView>
  );
};

const ShowcaseStack = createNativeStackNavigator({
  screens: {
    ExampleList: createNativeStackScreen({
      screen: ExampleListScreen,
      options: {
        title: 'Showcase',
        headerLargeTitleEnabled: true,
      },
    }),
    ...fromEntries(
      EXAMPLE_SCREENS.map((screen) => [
        screen.name,
        createNativeStackScreen({
          screen: screen.screen,
          options: {
            headerShown: false,
          },
        }),
      ])
    ),
  },
});

export const Showcase = {
  screen: ShowcaseStack,
  title: 'Showcase',
};
