import {
  createDrawerNavigator,
  DrawerContent,
  type DrawerContentComponentProps,
  type DrawerScreenProps,
} from '@react-navigation/drawer';
import {
  type ParamListBase,
  type PathConfigMap,
  useNavigation,
  useTheme,
} from '@react-navigation/native';
import type { StackScreenProps } from '@react-navigation/stack';
import * as React from 'react';
import { useWindowDimensions } from 'react-native';
import { Appbar } from 'react-native-paper';

import { Albums } from '../Shared/Albums';
import { Article } from '../Shared/Article';
import { NewsFeed } from '../Shared/NewsFeed';

export type MasterDetailParams = {
  Article: undefined;
  NewsFeed: undefined;
  Albums: undefined;
};

export const masterDetailLinking: PathConfigMap<MasterDetailParams> = {
  Article: 'article',
  NewsFeed: 'feed',
  Albums: 'albums',
};

const useIsLargeScreen = () => {
  const dimensions = useWindowDimensions();

  return dimensions.width > 414;
};

const Header = ({
  onGoBack,
  title,
}: {
  onGoBack: () => void;
  title: string;
}) => {
  const { colors } = useTheme();
  const isLargeScreen = useIsLargeScreen();

  return (
    <Appbar.Header style={{ backgroundColor: colors.card, elevation: 1 }}>
      {isLargeScreen ? null : <Appbar.BackAction onPress={onGoBack} />}
      <Appbar.Content title={title} />
    </Appbar.Header>
  );
};

const ArticleScreen = ({
  navigation,
}: DrawerScreenProps<MasterDetailParams, 'Article'>) => {
  return (
    <>
      <Header title="Article" onGoBack={() => navigation.toggleDrawer()} />
      <Article />
    </>
  );
};

const NewsFeedScreen = ({
  navigation,
}: DrawerScreenProps<MasterDetailParams, 'NewsFeed'>) => {
  return (
    <>
      <Header title="Feed" onGoBack={() => navigation.toggleDrawer()} />
      <NewsFeed />
    </>
  );
};

const AlbumsScreen = ({
  navigation,
}: DrawerScreenProps<MasterDetailParams, 'Albums'>) => {
  return (
    <>
      <Header title="Albums" onGoBack={() => navigation.toggleDrawer()} />
      <Albums />
    </>
  );
};

const CustomDrawerContent = (props: DrawerContentComponentProps) => {
  const { colors } = useTheme();
  const navigation = useNavigation();

  return (
    <>
      <Appbar.Header style={{ backgroundColor: colors.card, elevation: 1 }}>
        <Appbar.Action icon="close" onPress={() => navigation.goBack()} />
        <Appbar.Content title="Pages" />
      </Appbar.Header>
      <DrawerContent {...props} />
    </>
  );
};

const Drawer = createDrawerNavigator<MasterDetailParams>();

type Props = Partial<React.ComponentProps<typeof Drawer.Navigator>> &
  StackScreenProps<ParamListBase>;

export function MasterDetail({ navigation, ...rest }: Props) {
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
      gestureEnabled: false,
    });
  }, [navigation]);

  const isLargeScreen = useIsLargeScreen();

  return (
    <Drawer.Navigator
      backBehavior="none"
      defaultStatus="open"
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerType: isLargeScreen ? 'permanent' : 'back',
        drawerStyle: isLargeScreen ? null : { width: '100%' },
        drawerContentContainerStyle: { paddingTop: 4 },
        overlayColor: 'transparent',
      }}
      {...rest}
    >
      <Drawer.Screen name="Article" component={ArticleScreen} />
      <Drawer.Screen
        name="NewsFeed"
        component={NewsFeedScreen}
        options={{ title: 'Feed' }}
      />
      <Drawer.Screen
        name="Albums"
        component={AlbumsScreen}
        options={{ title: 'Albums' }}
      />
    </Drawer.Navigator>
  );
}
