import * as React from 'react';
import {
  Animated,
  View,
  StyleSheet,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import { Button, Appbar } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme, ParamListBase } from '@react-navigation/native';
import {
  createStackNavigator,
  StackScreenProps,
  HeaderBackground,
  useHeaderHeight,
  Header,
  StackHeaderProps,
} from '@react-navigation/stack';
import BlurView from '../Shared/BlurView';
import Article from '../Shared/Article';
import Albums from '../Shared/Albums';

type SimpleStackParams = {
  Article: { author: string };
  Albums: undefined;
};

const scrollEnabled = Platform.select({ web: true, default: false });

const ArticleScreen = ({
  navigation,
  route,
}: StackScreenProps<SimpleStackParams, 'Article'>) => {
  return (
    <ScrollView>
      <View style={styles.buttons}>
        <Button
          mode="contained"
          onPress={() => navigation.push('Albums')}
          style={styles.button}
        >
          Push album
        </Button>
        <Button
          mode="outlined"
          onPress={() => navigation.goBack()}
          style={styles.button}
        >
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

const AlbumsScreen = ({ navigation }: StackScreenProps<SimpleStackParams>) => {
  const headerHeight = useHeaderHeight();

  return (
    <ScrollView contentContainerStyle={{ paddingTop: headerHeight }}>
      <View style={styles.buttons}>
        <Button
          mode="contained"
          onPress={() => navigation.push('Article', { author: 'Babel fish' })}
          style={styles.button}
        >
          Push article
        </Button>
        <Button
          mode="outlined"
          onPress={() => navigation.goBack()}
          style={styles.button}
        >
          Go back
        </Button>
      </View>
      <Albums scrollEnabled={scrollEnabled} />
    </ScrollView>
  );
};

const SimpleStack = createStackNavigator<SimpleStackParams>();

type Props = Partial<React.ComponentProps<typeof SimpleStack.Navigator>> &
  StackScreenProps<ParamListBase>;

function CustomHeader(props: StackHeaderProps) {
  const { current, next } = props.scene.progress;

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

export default function SimpleStackScreen({ navigation, ...rest }: Props) {
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const { colors, dark } = useTheme();

  return (
    <SimpleStack.Navigator {...rest}>
      <SimpleStack.Screen
        name="Article"
        component={ArticleScreen}
        options={({ route }) => ({
          title: `Article by ${route.params?.author}`,
          header: CustomHeader,
          headerTintColor: '#fff',
          headerStyle: { backgroundColor: '#ff005d' },
          headerBackTitleVisible: false,
          headerTitleAlign: 'center',
          headerBackImage: ({ tintColor }) => (
            <MaterialCommunityIcons
              name="arrow-left-circle-outline"
              color={tintColor}
              size={24}
              style={{ marginHorizontal: Platform.OS === 'ios' ? 8 : 0 }}
            />
          ),
          headerRight: ({ tintColor }) => (
            <Appbar.Action
              color={tintColor}
              icon="dots-horizontal-circle-outline"
              onPress={() =>
                Alert.alert(
                  'Never gonna give you up!',
                  'Never gonna let you down! Never gonna run around and desert you!'
                )
              }
            />
          ),
        })}
        initialParams={{ author: 'Gandalf' }}
      />
      <SimpleStack.Screen
        name="Albums"
        component={AlbumsScreen}
        options={{
          title: 'Albums',
          headerBackTitle: 'Back',
          headerTransparent: true,
          headerBackground: () => (
            <HeaderBackground
              style={{
                backgroundColor: 'transparent',
                borderBottomWidth: StyleSheet.hairlineWidth,
                borderBottomColor: colors.border,
              }}
            >
              <BlurView
                tint={dark ? 'dark' : 'light'}
                intensity={75}
                style={StyleSheet.absoluteFill}
              />
            </HeaderBackground>
          ),
        }}
      />
    </SimpleStack.Navigator>
  );
}

const styles = StyleSheet.create({
  buttons: {
    flexDirection: 'row',
    padding: 8,
  },
  button: {
    margin: 8,
  },
  banner: {
    textAlign: 'center',
    color: 'tomato',
    backgroundColor: 'papayawhip',
    padding: 4,
  },
});
