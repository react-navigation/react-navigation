import * as React from 'react';
import { Dimensions, ScaledSize } from 'react-native';
import { Appbar } from 'react-native-paper';
import {
  useTheme,
  useNavigation,
  ParamListBase,
} from '@react-navigation/native';
import {
  createDrawerNavigator,
  DrawerScreenProps,
  DrawerContent,
  DrawerContentComponentProps,
  DrawerContentOptions,
} from '@react-navigation/drawer';
import type { StackScreenProps } from '@react-navigation/stack';
import Article from '../Shared/Article';
import Albums from '../Shared/Albums';
import NewsFeed from '../Shared/NewsFeed';

type DrawerParams = {
  Article: undefined;
  NewsFeed: undefined;
  Albums: undefined;
};

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
}: DrawerScreenProps<DrawerParams, 'Article'>) => {
  return (
    <>
      <Header title="Article" onGoBack={() => navigation.toggleDrawer()} />
      <Article />
    </>
  );
};

const NewsFeedScreen = ({
  navigation,
}: DrawerScreenProps<DrawerParams, 'NewsFeed'>) => {
  return (
    <>
      <Header title="Feed" onGoBack={() => navigation.toggleDrawer()} />
      <NewsFeed />
    </>
  );
};

const AlbumsScreen = ({
  navigation,
}: DrawerScreenProps<DrawerParams, 'Albums'>) => {
  return (
    <>
      <Header title="Albums" onGoBack={() => navigation.toggleDrawer()} />
      <Albums />
    </>
  );
};

const CustomDrawerContent = (
  props: DrawerContentComponentProps<DrawerContentOptions>
) => {
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

const Drawer = createDrawerNavigator<DrawerParams>();

type Props = Partial<React.ComponentProps<typeof Drawer.Navigator>> &
  StackScreenProps<ParamListBase>;

export default function DrawerScreen({ navigation, ...rest }: Props) {
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
      gestureEnabled: false,
    });
  }, [navigation]);

  const isLargeScreen = useIsLargeScreen();

  return (
    <Drawer.Navigator
      openByDefault
      drawerType={isLargeScreen ? 'permanent' : 'back'}
      drawerStyle={isLargeScreen ? null : { width: '100%' }}
      overlayColor="transparent"
      drawerContent={(props) => <CustomDrawerContent {...props} />}
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
