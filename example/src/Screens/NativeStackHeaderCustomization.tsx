import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Button, HeaderButton } from '@react-navigation/elements';
import type { ParamListBase, PathConfigMap } from '@react-navigation/native';
import {
  createNativeStackNavigator,
  type NativeStackScreenProps,
} from '@react-navigation/native-stack';
import * as React from 'react';
import {
  Alert,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

import { COMMON_LINKING_CONFIG } from '../constants';
import { Albums } from '../Shared/Albums';
import { Article } from '../Shared/Article';
import { NewsFeed } from '../Shared/NewsFeed';

export type NativeHeaderCustomizationStackParams = {
  Article: { author: string } | undefined;
  NewsFeed: { date: number };
  Albums: undefined;
};

export const nativeHeaderCustomizationStackLinking: PathConfigMap<NativeHeaderCustomizationStackParams> =
  {
    Article: COMMON_LINKING_CONFIG.Article,
    NewsFeed: COMMON_LINKING_CONFIG.NewsFeed,
    Albums: 'albums',
  };

const scrollEnabled = Platform.select({ web: true, default: false });

const ArticleScreen = ({
  navigation,
  route,
}: NativeStackScreenProps<NativeHeaderCustomizationStackParams, 'Article'>) => {
  return (
    <ScrollView>
      <View style={styles.buttons}>
        <Button
          variant="filled"
          onPress={() => navigation.push('NewsFeed', { date: Date.now() })}
        >
          Push feed
        </Button>
        <Button variant="tinted" onPress={() => navigation.pop()}>
          Pop screen
        </Button>
      </View>
      <Article
        author={{ name: route.params?.author ?? 'Unknown' }}
        scrollEnabled={scrollEnabled}
      />
    </ScrollView>
  );
};

const NewsFeedScreen = ({
  route,
  navigation,
}: NativeStackScreenProps<
  NativeHeaderCustomizationStackParams,
  'NewsFeed'
>) => {
  return (
    <ScrollView>
      <View style={styles.buttons}>
        <Button variant="filled" onPress={() => navigation.push('Albums')}>
          Push Albums
        </Button>
        <Button variant="tinted" onPress={() => navigation.goBack()}>
          Go back
        </Button>
      </View>
      <NewsFeed scrollEnabled={scrollEnabled} date={route.params.date} />
    </ScrollView>
  );
};

const AlbumsScreen = ({
  navigation,
}: NativeStackScreenProps<NativeHeaderCustomizationStackParams, 'Albums'>) => {
  return (
    <ScrollView>
      <View style={styles.buttons}>
        <Button
          variant="filled"
          onPress={() =>
            navigation.navigate('Article', { author: 'Babel fish' })
          }
        >
          Navigate to article
        </Button>
        <Button variant="tinted" onPress={() => navigation.pop(2)}>
          Pop by 2
        </Button>
      </View>
      <Albums scrollEnabled={scrollEnabled} />
    </ScrollView>
  );
};

const Stack =
  createNativeStackNavigator<NativeHeaderCustomizationStackParams>();

export function NativeStackHeaderCustomization({
  navigation,
}: NativeStackScreenProps<ParamListBase>) {
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
      gestureEnabled: false,
    });
  }, [navigation]);

  const onPress = () => {
    Alert.alert(
      'Never gonna give you up!',
      'Never gonna let you down! Never gonna run around and desert you!'
    );
  };

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Article"
        component={ArticleScreen}
        options={({ route, navigation }) => ({
          title: `Article by ${route.params?.author ?? 'Unknown'}`,
          headerTintColor: 'white',
          headerTitle: ({ tintColor }) => (
            <HeaderButton onPress={onPress}>
              <MaterialCommunityIcons
                name="signal-5g"
                size={24}
                color={tintColor}
              />
            </HeaderButton>
          ),
          headerLeft: ({ tintColor, canGoBack }) =>
            canGoBack ? (
              <HeaderButton onPress={navigation.goBack}>
                <MaterialCommunityIcons
                  name="arrow-left-thick"
                  size={24}
                  color={tintColor}
                />
              </HeaderButton>
            ) : null,
          headerRight: ({ tintColor }) => (
            <HeaderButton onPress={onPress}>
              <MaterialCommunityIcons
                name="music"
                size={24}
                color={tintColor}
              />
            </HeaderButton>
          ),
          headerBackground: () => (
            <Image
              source={require('../../assets/cpu.jpg')}
              resizeMode="cover"
              style={styles.headerBackground}
            />
          ),
        })}
        initialParams={{ author: 'Gandalf' }}
      />
      <Stack.Screen
        name="NewsFeed"
        component={NewsFeedScreen}
        options={{
          title: 'Feed',
          headerLeft: ({ tintColor }) => (
            <HeaderButton onPress={onPress}>
              <MaterialCommunityIcons name="spa" size={24} color={tintColor} />
            </HeaderButton>
          ),
        }}
      />
      <Stack.Screen
        name="Albums"
        component={AlbumsScreen}
        options={{
          title: 'Albums',
          headerTintColor: 'tomato',
          headerStyle: { backgroundColor: 'papayawhip' },
          headerBackVisible: true,
          headerLeft: ({ tintColor }) => (
            <HeaderButton onPress={onPress}>
              <MaterialCommunityIcons
                name="music"
                size={24}
                color={tintColor}
              />
            </HeaderButton>
          ),
        }}
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
  headerBackground: {
    height: undefined,
    width: undefined,
    flex: 1,
  },
});
