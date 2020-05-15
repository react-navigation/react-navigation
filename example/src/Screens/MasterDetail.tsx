import * as React from 'react';
import { Dimensions, ScaledSize } from 'react-native';
import { Appbar } from 'react-native-paper';
import { ParamListBase } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import {
  createDrawerNavigator,
  DrawerNavigationProp,
  DrawerContent,
} from '@react-navigation/drawer';
import Article from '../Shared/Article';
import Albums from '../Shared/Albums';
import NewsFeed from '../Shared/NewsFeed';

type DrawerParams = {
  Article: undefined;
  NewsFeed: undefined;
  Albums: undefined;
};

type DrawerNavigation = DrawerNavigationProp<DrawerParams>;

const useIsLargeScreen = () => {
  const [dimensions, setDimensions] = React.useState(Dimensions.get('window'));

  React.useEffect(() => {
    const onDimensionsChange = ({ window }: { window: ScaledSize }) => {
      setDimensions(window);
    };

    Dimensions.addEventListener('change', onDimensionsChange);

    return () => Dimensions.removeEventListener('change', onDimensionsChange);
  }, []);

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
    <Appbar.Header>
      {isLargeScreen ? null : <Appbar.BackAction onPress={onGoBack} />}
      <Appbar.Content title={title} />
    </Appbar.Header>
  );
};

const ArticleScreen = ({ navigation }: { navigation: DrawerNavigation }) => {
  return (
    <>
      <Header title="Article" onGoBack={() => navigation.toggleDrawer()} />
      <Article />
    </>
  );
};

const NewsFeedScreen = ({ navigation }: { navigation: DrawerNavigation }) => {
  return (
    <>
      <Header title="Feed" onGoBack={() => navigation.toggleDrawer()} />
      <NewsFeed />
    </>
  );
};

const AlbumsScreen = ({ navigation }: { navigation: DrawerNavigation }) => {
  return (
    <>
      <Header title="Albums" onGoBack={() => navigation.toggleDrawer()} />
      <Albums />
    </>
  );
};

const Drawer = createDrawerNavigator<DrawerParams>();

type Props = Partial<React.ComponentProps<typeof Drawer.Navigator>> & {
  navigation: StackNavigationProp<ParamListBase>;
};

export default function DrawerScreen({ navigation, ...rest }: Props) {
  navigation.setOptions({
    headerShown: false,
    gestureEnabled: false,
  });

  const isLargeScreen = useIsLargeScreen();

  return (
    <Drawer.Navigator
      openByDefault
      drawerType={isLargeScreen ? 'permanent' : 'back'}
      drawerStyle={isLargeScreen ? null : { width: '100%' }}
      overlayColor="transparent"
      drawerContent={(props) => (
        <>
          <Appbar.Header>
            <Appbar.Action icon="close" onPress={() => navigation.goBack()} />
            <Appbar.Content title="Pages" />
          </Appbar.Header>
          <DrawerContent {...props} />
        </>
      )}
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
