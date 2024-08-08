import { Button, Text, useHeaderHeight } from '@react-navigation/elements';
import { type PathConfigMap, useTheme } from '@react-navigation/native';
import {
  createNativeStackNavigator,
  type NativeStackScreenProps,
  useAnimatedHeaderHeight,
} from '@react-navigation/native-stack';
import * as React from 'react';
import { Animated, Platform, ScrollView, StyleSheet, View } from 'react-native';

import { COMMON_LINKING_CONFIG } from '../constants';
import { Albums } from '../Shared/Albums';
import { Article } from '../Shared/Article';
import { Contacts } from '../Shared/Contacts';
import { NewsFeed } from '../Shared/NewsFeed';

export type NativeStackParams = {
  Article: { author: string } | undefined;
  NewsFeed: { date: number };
  Contacts: undefined;
  Albums: undefined;
};

const linking: PathConfigMap<NativeStackParams> = {
  Article: COMMON_LINKING_CONFIG.Article,
  NewsFeed: COMMON_LINKING_CONFIG.NewsFeed,
  Contacts: 'contacts',
  Albums: 'albums',
};

const scrollEnabled = Platform.select({ web: true, default: false });

const ArticleScreen = ({
  navigation,
  route,
}: NativeStackScreenProps<NativeStackParams, 'Article'>) => {
  return (
    <View>
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <View style={styles.buttons}>
          <Button
            variant="filled"
            onPress={() => navigation.push('NewsFeed', { date: Date.now() })}
          >
            Push feed
          </Button>
          <Button
            variant="filled"
            onPress={() => navigation.replace('NewsFeed', { date: Date.now() })}
          >
            Replace with feed
          </Button>
          <Button variant="filled" onPress={() => navigation.popTo('Albums')}>
            Pop to albums
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
      <HeaderHeightView />
    </View>
  );
};

const NewsFeedScreen = ({
  route,
  navigation,
}: NativeStackScreenProps<NativeStackParams, 'NewsFeed'>) => {
  return (
    <View>
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <View style={styles.buttons}>
          <Button variant="filled" onPress={() => navigation.push('Contacts')}>
            Push contacts
          </Button>
          <Button variant="tinted" onPress={() => navigation.goBack()}>
            Go back
          </Button>
        </View>
        <NewsFeed scrollEnabled={scrollEnabled} date={route.params.date} />
      </ScrollView>
      <HeaderHeightView />
    </View>
  );
};

const ContactsScreen = ({
  navigation,
}: NativeStackScreenProps<NativeStackParams, 'Contacts'>) => {
  const [query, setQuery] = React.useState('');

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerSearchBarOptions: {
        placeholder: 'Filter contacts',
        placement: 'inline',
        onChangeText: (e) => {
          setQuery(e.nativeEvent.text);
        },
      },
    });
  }, [navigation]);

  return (
    <Contacts
      query={query}
      contentInsetAdjustmentBehavior="automatic"
      ListHeaderComponent={
        <View style={styles.buttons}>
          <Button variant="filled" onPress={() => navigation.push('Albums')}>
            Push albums
          </Button>
          <Button variant="tinted" onPress={() => navigation.goBack()}>
            Go back
          </Button>
        </View>
      }
    />
  );
};

const AlbumsScreen = ({
  navigation,
}: NativeStackScreenProps<NativeStackParams, 'Albums'>) => {
  const headerHeight = useHeaderHeight();

  return (
    <View>
      <ScrollView contentContainerStyle={{ paddingTop: headerHeight }}>
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
      <HeaderHeightView hasOffset />
    </View>
  );
};

const HeaderHeightView = ({
  hasOffset = Platform.OS === 'ios',
}: {
  hasOffset?: boolean;
}) => {
  const { colors } = useTheme();

  const animatedHeaderHeight = useAnimatedHeaderHeight();
  const headerHeight = useHeaderHeight();

  return (
    <Animated.View
      style={[
        styles.headerHeight,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          shadowColor: colors.border,
        },
        hasOffset && {
          transform: [{ translateY: animatedHeaderHeight }],
        },
      ]}
    >
      <Text>{headerHeight.toFixed(2)}</Text>
    </Animated.View>
  );
};

const Stack = createNativeStackNavigator<NativeStackParams>();

export function NativeStack() {
  const { colors } = useTheme();

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Article"
        component={ArticleScreen}
        options={({ route }) => ({
          title: `Article by ${route.params?.author ?? 'Unknown'}`,
          headerLargeTitle: true,
          headerLargeTitleShadowVisible: false,
        })}
        initialParams={{ author: 'Gandalf' }}
      />
      <Stack.Screen
        name="NewsFeed"
        component={NewsFeedScreen}
        options={{
          title: 'Feed',
          fullScreenGestureEnabled: true,
        }}
      />
      <Stack.Screen
        name="Contacts"
        component={ContactsScreen}
        options={{
          headerSearchBarOptions: {
            placeholder: 'Filter contacts',
          },
        }}
      />
      <Stack.Screen
        name="Albums"
        component={AlbumsScreen}
        options={{
          title: 'Albums',
          presentation: 'modal',
          headerTransparent: true,
          headerBlurEffect: 'light',
          headerStyle: {
            backgroundColor: Platform.select({
              // Add a background color since Android doesn't support blur effect
              android: colors.card,
              default: 'transparent',
            }),
          },
        }}
      />
    </Stack.Navigator>
  );
}

NativeStack.title = 'Native Stack';
NativeStack.linking = linking;
NativeStack.options = {
  gestureEnabled: false,
};

const styles = StyleSheet.create({
  buttons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    padding: 12,
  },
  headerHeight: {
    position: 'absolute',
    top: 0,
    right: 0,
    padding: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderRightWidth: 0,
    borderTopWidth: 0,
    borderBottomLeftRadius: 3,
  },
});
