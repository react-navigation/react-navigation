import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import {
  Button,
  HeaderBackground,
  HeaderButton,
  useHeaderHeight,
} from '@react-navigation/elements';
import {
  type ParamListBase,
  type PathConfigMap,
} from '@react-navigation/native';
import {
  createStackNavigator,
  Header,
  type StackHeaderProps,
  type StackScreenProps,
} from '@react-navigation/stack';
import * as React from 'react';
import {
  Alert,
  Animated,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

import { COMMON_LINKING_CONFIG } from '../constants';
import { Albums } from '../Shared/Albums';
import { Article } from '../Shared/Article';
import { BlurView } from '../Shared/BlurView';

export type HeaderCustomizationStackParams = {
  Article: { author: string };
  Albums: undefined;
};

export const headerCustomizationStackLinking: PathConfigMap<HeaderCustomizationStackParams> =
  {
    Article: COMMON_LINKING_CONFIG.Article,
    Albums: 'albums',
  };

const scrollEnabled = Platform.select({ web: true, default: false });

const ArticleScreen = ({
  navigation,
  route,
}: StackScreenProps<HeaderCustomizationStackParams, 'Article'>) => {
  return (
    <ScrollView>
      <View style={styles.buttons}>
        <Button variant="filled" onPress={() => navigation.push('Albums')}>
          Push album
        </Button>
        <Button variant="tinted" onPress={() => navigation.goBack()}>
          Go back
        </Button>
      </View>
      <Article
        author={{ name: route.params.author }}
        scrollEnabled={scrollEnabled}
      />
    </ScrollView>
  );
};

const AlbumsScreen = ({
  navigation,
}: StackScreenProps<HeaderCustomizationStackParams>) => {
  const headerHeight = useHeaderHeight();

  return (
    <ScrollView contentContainerStyle={{ paddingTop: headerHeight }}>
      <View style={styles.buttons}>
        <Button
          variant="filled"
          onPress={() => navigation.push('Article', { author: 'Babel fish' })}
        >
          Push article
        </Button>
        <Button variant="tinted" onPress={() => navigation.goBack()}>
          Go back
        </Button>
      </View>
      <Albums scrollEnabled={scrollEnabled} />
    </ScrollView>
  );
};

const Stack = createStackNavigator<HeaderCustomizationStackParams>();

type Props = StackScreenProps<ParamListBase>;

function CustomHeader(props: StackHeaderProps) {
  const { current, next } = props.progress;

  const progress = Animated.add(current, next || 0);
  const opacity = progress.interpolate({
    inputRange: [0, 1, 2],
    outputRange: [0, 1, 0],
  });

  return (
    <>
      <Header {...props} />
      <Animated.Text style={[styles.banner, { opacity }]}>
        Why hello there, pardner!
      </Animated.Text>
    </>
  );
}

export function StackHeaderCustomization({ navigation }: Props) {
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const [headerTitleCentered, setHeaderTitleCentered] = React.useState(true);

  return (
    <Stack.Navigator screenOptions={{ headerMode: 'float' }}>
      <Stack.Screen
        name="Article"
        component={ArticleScreen}
        options={({ route }) => ({
          title: `Article by ${route.params?.author}`,
          header: (props) => <CustomHeader {...props} />,
          headerTintColor: '#fff',
          headerStyle: { backgroundColor: '#ff005d' },
          headerBackTitleVisible: false,
          headerTitleAlign: headerTitleCentered ? 'center' : 'left',
          headerBackImage: ({ tintColor }) => (
            <MaterialCommunityIcons
              name="arrow-left-circle-outline"
              color={tintColor}
              size={24}
              style={{ marginHorizontal: Platform.OS === 'ios' ? 8 : 0 }}
            />
          ),
          headerRight: ({ tintColor }) => (
            <HeaderButton
              onPress={() => {
                setHeaderTitleCentered((centered) => !centered);
                Alert.alert(
                  'Never gonna give you up!',
                  'Never gonna let you down! Never gonna run around and desert you!'
                );
              }}
            >
              <MaterialCommunityIcons
                name="dots-horizontal-circle-outline"
                size={24}
                color={tintColor}
              />
            </HeaderButton>
          ),
        })}
        initialParams={{ author: 'Gandalf' }}
      />
      <Stack.Screen
        name="Albums"
        component={AlbumsScreen}
        options={({ theme }) => ({
          title: 'Albums',
          headerBackTitle: 'Back',
          headerTransparent: true,
          headerBackground: () => (
            <HeaderBackground
              style={{
                backgroundColor: 'blue',
                borderBottomWidth: StyleSheet.hairlineWidth,
                borderBottomColor: theme.colors.border,
              }}
            >
              <BlurView
                tint={theme.dark ? 'dark' : 'light'}
                intensity={75}
                style={StyleSheet.absoluteFill}
              />
            </HeaderBackground>
          ),
        })}
      />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  buttons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    padding: 12,
  },
  banner: {
    textAlign: 'center',
    color: 'tomato',
    backgroundColor: 'papayawhip',
    padding: 4,
  },
});
