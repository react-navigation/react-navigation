import {
  createDrawerNavigator,
  createDrawerScreen,
  DrawerContent,
  type DrawerContentComponentProps,
} from '@react-navigation/drawer';
import {
  Header as NavigationHeader,
  HeaderBackButton,
} from '@react-navigation/elements';
import { useNavigation } from '@react-navigation/native';
import { useWindowDimensions } from 'react-native';

import { COMMON_LINKING_CONFIG } from '../constants';
import { Albums } from '../Shared/Albums';
import { Article } from '../Shared/Article';
import { NewsFeed } from '../Shared/NewsFeed';

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
  const isLargeScreen = useIsLargeScreen();

  return (
    <NavigationHeader
      title={title}
      headerLeft={
        isLargeScreen
          ? undefined
          : (props) => <HeaderBackButton {...props} onPress={onGoBack} />
      }
    />
  );
};

const ArticleScreen = () => {
  const navigation = useNavigation('Article');

  return (
    <>
      <Header title="Article" onGoBack={() => navigation.toggleDrawer()} />
      <Article />
    </>
  );
};

const NewsFeedScreen = () => {
  const navigation = useNavigation('NewsFeed');

  return (
    <>
      <Header title="Feed" onGoBack={() => navigation.toggleDrawer()} />
      <NewsFeed />
    </>
  );
};

const AlbumsScreen = () => {
  const navigation = useNavigation('Albums');

  return (
    <>
      <Header title="Albums" onGoBack={() => navigation.toggleDrawer()} />
      <Albums />
    </>
  );
};

const CustomDrawerContent = (props: DrawerContentComponentProps) => {
  const navigation = useNavigation();

  return (
    <>
      <NavigationHeader
        title="Pages"
        headerLeft={(props) => (
          <HeaderBackButton {...props} onPress={() => navigation.goBack()} />
        )}
      />
      <DrawerContent {...props} />
    </>
  );
};

const DrawerMasterDetailNavigator = createDrawerNavigator({
  backBehavior: 'none',
  defaultStatus: 'open',
  drawerContent: (props) => <CustomDrawerContent {...props} />,
  screenOptions: {
    headerShown: false,
    drawerContentContainerStyle: { paddingTop: 4 },
    overlayStyle: { backgroundColor: 'transparent' },
  },
  screens: {
    Article: createDrawerScreen({
      screen: ArticleScreen,
      initialParams: { author: 'Gandalf' },
      linking: COMMON_LINKING_CONFIG.Article,
    }),
    NewsFeed: createDrawerScreen({
      screen: NewsFeedScreen,
      options: { title: 'Feed' },
      initialParams: { date: 0 },
      linking: COMMON_LINKING_CONFIG.NewsFeed,
    }),
    Albums: createDrawerScreen({
      screen: AlbumsScreen,
      options: { title: 'Albums' },
      linking: 'albums',
    }),
  },
}).with(({ Navigator }) => {
  const isLargeScreen = useIsLargeScreen();

  return (
    <Navigator
      screenOptions={{
        drawerType: isLargeScreen ? 'permanent' : 'back',
        drawerStyle: isLargeScreen ? null : { width: '100%' },
      }}
    />
  );
});

export const DrawerMasterDetail = {
  screen: DrawerMasterDetailNavigator,
  title: 'Drawer - Master Detail',
};
