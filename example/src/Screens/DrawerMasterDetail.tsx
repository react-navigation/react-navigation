import {
  createDrawerNavigator,
  DrawerContent,
  type DrawerContentComponentProps,
  type DrawerScreenProps,
} from '@react-navigation/drawer';
import {
  Header as NavigationHeader,
  HeaderBackButton,
} from '@react-navigation/elements';
import {
  type NavigatorScreenParams,
  type PathConfig,
  type StaticScreenProps,
  useNavigation,
} from '@react-navigation/native';
import { useWindowDimensions } from 'react-native';

import { Albums } from '../Shared/Albums';
import { Article } from '../Shared/Article';
import { NewsFeed } from '../Shared/NewsFeed';

type MasterDetailParamList = {
  Article: undefined;
  NewsFeed: undefined;
  Albums: undefined;
};

const linking = {
  screens: {
    Article: 'article',
    NewsFeed: 'feed',
    Albums: 'albums',
  },
} satisfies PathConfig<NavigatorScreenParams<MasterDetailParamList>>;

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

const ArticleScreen = ({
  navigation,
}: DrawerScreenProps<MasterDetailParamList, 'Article'>) => {
  return (
    <>
      <Header title="Article" onGoBack={() => navigation.toggleDrawer()} />
      <Article />
    </>
  );
};

const NewsFeedScreen = ({
  navigation,
}: DrawerScreenProps<MasterDetailParamList, 'NewsFeed'>) => {
  return (
    <>
      <Header title="Feed" onGoBack={() => navigation.toggleDrawer()} />
      <NewsFeed />
    </>
  );
};

const AlbumsScreen = ({
  navigation,
}: DrawerScreenProps<MasterDetailParamList, 'Albums'>) => {
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

const Drawer = createDrawerNavigator<MasterDetailParamList>();

export function DrawerMasterDetail(
  _: StaticScreenProps<NavigatorScreenParams<MasterDetailParamList>>
) {
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
        overlayStyle: { backgroundColor: 'transparent' },
      }}
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

DrawerMasterDetail.title = 'Drawer - Master Detail';
DrawerMasterDetail.linking = linking;
