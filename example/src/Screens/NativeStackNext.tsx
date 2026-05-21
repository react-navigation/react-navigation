import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import {
  Button,
  getHeaderTitle,
  Header,
  HeaderButton,
  Text,
} from '@react-navigation/elements';
import {
  useNavigation,
  useNavigationState,
  useRoute,
} from '@react-navigation/native';
// eslint-disable-next-line no-restricted-imports
import {
  createNativeStackNavigator,
  createNativeStackScreen,
} from '@react-navigation/native-stack/next';
import * as React from 'react';
import {
  Alert,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

import { Article } from '../Shared/Article';
import { NewsFeed } from '../Shared/NewsFeed';

const scrollEnabled = Platform.select({ web: true, default: false });

const onPress = () => {
  Alert.alert('Header button pressed');
};

const HomeScreen = () => {
  const navigation = useNavigation('NativeStackNextHome');
  const [isReady, setIsReady] = React.useState(false);
  const timerRef = React.useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined
  );

  React.useEffect(() => {
    return navigation.addListener('blur', () => {
      clearTimeout(timerRef.current);
      setIsReady(false);
    });
  }, [navigation]);

  return (
    <View style={styles.content}>
      <Button
        variant="filled"
        onPress={() => navigation.navigate('NativeStackNextCustomHeader')}
        style={styles.button}
      >
        Custom header
      </Button>
      <Button
        variant="filled"
        onPress={() => navigation.navigate('NativeStackNextLargeTitle')}
        style={styles.button}
      >
        Large title
      </Button>
      <Button
        variant="filled"
        onPress={() => navigation.navigate('NativeStackNextHeaderStyle')}
        style={styles.button}
      >
        Header background
      </Button>
      <Button
        variant="filled"
        onPress={() => {
          timerRef.current = setTimeout(() => {
            setIsReady(true);
          }, 5000);

          navigation.preload('NativeStackNextPreloaded');
        }}
        style={styles.button}
      >
        Preload screen
      </Button>
      <Button
        variant={isReady ? 'filled' : 'tinted'}
        onPress={() => navigation.navigate('NativeStackNextPreloaded')}
        style={styles.button}
      >
        {isReady ? 'Open preloaded screen' : 'Open screen'}
      </Button>
    </View>
  );
};

const CustomHeaderScreen = () => {
  const navigation = useNavigation('NativeStackNextCustomHeader');

  return (
    <View style={styles.content}>
      <Button
        variant="tinted"
        onPress={() => navigation.goBack()}
        style={styles.button}
      >
        Go back
      </Button>
    </View>
  );
};

const LargeTitleScreen = () => (
  <ScrollView contentInsetAdjustmentBehavior="automatic">
    <Article author={{ name: 'Gandalf' }} scrollEnabled={scrollEnabled} />
  </ScrollView>
);

const HeaderStyleScreen = () => {
  const navigation = useNavigation('NativeStackNextHeaderStyle');

  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic">
      <View style={styles.buttons}>
        <Button
          variant="filled"
          onPress={() => navigation.navigate('NativeStackNextHeaderControls')}
        >
          Header buttons
        </Button>
      </View>
      <Article author={{ name: 'Babel fish' }} scrollEnabled={scrollEnabled} />
    </ScrollView>
  );
};

const HeaderControlsScreen = () => {
  const navigation = useNavigation('NativeStackNextHeaderControls');

  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic">
      <View style={styles.buttons}>
        <Button variant="tinted" onPress={() => navigation.pop(2)}>
          Pop by 2
        </Button>
        <Button variant="tinted" onPress={() => navigation.pop()}>
          Go back
        </Button>
      </View>
      <NewsFeed scrollEnabled={scrollEnabled} />
    </ScrollView>
  );
};

const PreloadedScreen = () => {
  const navigation = useNavigation('NativeStackNextPreloaded');
  const route = useRoute('NativeStackNextPreloaded');

  const [isPreloaded] = React.useState(
    useNavigationState('NativeStackNextPreloaded', (state) => {
      const index = state.routes.findIndex((r) => r.key === route.key);

      return (
        index > state.index && !state.retainedRouteKeys.includes(route.key)
      );
    })
  );

  const isRetained = useNavigationState('NativeStackNextPreloaded', (state) =>
    state.retainedRouteKeys.includes(route.key)
  );

  const [loadingCountdown, setLoadingCountdown] = React.useState(3);

  React.useEffect(() => {
    if (loadingCountdown === 0) {
      return;
    }

    const timer = setTimeout(
      () => setLoadingCountdown(loadingCountdown - 1),
      1000
    );

    return () => clearTimeout(timer);
  }, [loadingCountdown]);

  return (
    <View style={styles.content}>
      <Text style={[styles.text, styles.countdown]}>
        {loadingCountdown > 0 && loadingCountdown}
      </Text>
      <Text style={styles.text}>
        {loadingCountdown === 0 ? 'Loaded!' : 'Loading...'}
      </Text>
      <Text style={styles.text}>{isPreloaded ? 'Preloaded' : 'Fresh'}</Text>
      <Text style={styles.text}>
        {isRetained ? 'Retained' : 'Not retained'}
      </Text>
      <Button
        variant="filled"
        onPress={() => navigation.retain(isRetained ? false : true)}
        style={styles.button}
      >
        {isRetained ? 'Unretain' : 'Retain'}
      </Button>
      <Button
        variant="tinted"
        onPress={() => navigation.goBack()}
        style={styles.button}
      >
        Go back
      </Button>
    </View>
  );
};

const NativeStackNextNavigator = createNativeStackNavigator({
  screens: {
    NativeStackNextHome: createNativeStackScreen({
      screen: HomeScreen,
      options: {
        title: 'Next stack',
      },
      linking: '',
    }),
    NativeStackNextCustomHeader: createNativeStackScreen({
      screen: CustomHeaderScreen,
      options: {
        title: 'Custom header',
        header: ({ options, route, back }) => (
          <Header
            {...options}
            back={back}
            title={getHeaderTitle(options, route.name)}
          />
        ),
      },
      linking: 'custom-header',
    }),
    NativeStackNextLargeTitle: createNativeStackScreen({
      screen: LargeTitleScreen,
      options: {
        title: 'Large title',
        headerLargeTitleEnabled: true,
      },
      linking: 'large-title',
    }),
    NativeStackNextHeaderStyle: createNativeStackScreen({
      screen: HeaderStyleScreen,
      options: {
        title: 'Header background',
        headerTintColor: 'white',
        headerTransparent: true,
        headerBackground: () => (
          <Image
            source={require('../../assets/misc/cpu.jpg')}
            resizeMode="cover"
            style={StyleSheet.absoluteFill}
          />
        ),
        contentStyle: {
          backgroundColor: 'rgba(255, 99, 71, 0.08)',
        },
      },
      linking: 'header-style',
    }),
    NativeStackNextHeaderControls: createNativeStackScreen({
      screen: HeaderControlsScreen,
      options: {
        title: 'Header buttons',
        headerBackVisible: true,
        headerTintColor: 'mediumseagreen',
        headerLeft: ({ tintColor }) => (
          <HeaderButton onPress={onPress}>
            <MaterialCommunityIcons name="menu" size={24} color={tintColor} />
          </HeaderButton>
        ),
        headerRight: ({ tintColor }) => (
          <HeaderButton onPress={onPress}>
            <MaterialCommunityIcons name="star" size={24} color={tintColor} />
          </HeaderButton>
        ),
        inactiveBehavior: 'pause',
      },
      linking: 'header-controls',
    }),
    NativeStackNextPreloaded: createNativeStackScreen({
      screen: PreloadedScreen,
      options: {
        title: 'Preloaded screen',
      },
      linking: 'preloaded',
    }),
  },
});

export const NativeStackNext = {
  screen: NativeStackNextNavigator,
  title: 'Native Stack - Next',
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  button: {
    margin: 8,
  },
  buttons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
    margin: 12,
  },
  text: {
    textAlign: 'center',
    margin: 8,
  },
  countdown: {
    fontSize: 24,
    minHeight: 32,
  },
});
