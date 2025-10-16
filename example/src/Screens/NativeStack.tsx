import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import {
  Button,
  HeaderButton,
  Text,
  useHeaderHeight,
} from '@react-navigation/elements';
import { type PathConfigMap, useTheme } from '@react-navigation/native';
import {
  createNativeStackNavigator,
  type NativeStackHeaderItem,
  type NativeStackScreenProps,
  useAnimatedHeaderHeight,
} from '@react-navigation/native-stack';
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
    <View style={styles.container}>
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <View style={styles.buttons}>
          <Button
            variant="filled"
            onPress={() =>
              navigation.navigate('NewsFeed', { date: Date.now() })
            }
          >
            Navigate to feed
          </Button>
          <Button variant="filled" onPress={() => navigation.popTo('Albums')}>
            Pop to albums
          </Button>
          <Button
            variant="tinted"
            onPress={() =>
              navigation.setParams({
                author:
                  route.params?.author === 'Gandalf' ? 'Babel fish' : 'Gandalf',
              })
            }
          >
            Update params
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
    <View style={styles.container}>
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <View style={styles.buttons}>
          <Button
            variant="filled"
            onPress={() => navigation.replace('Contacts')}
          >
            Replace with contacts
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
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingTop: headerHeight }}>
        <View style={styles.buttons}>
          <Button
            variant="filled"
            onPress={() => navigation.push('Article', { author: 'Babel fish' })}
          >
            Push article
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
        options={({ route, navigation }) => {
          const leftItems: NativeStackHeaderItem[] = [
            {
              label: 'Back',
              onPress: () => navigation.goBack(),
            },
          ];

          const rightItems: NativeStackHeaderItem[] = [
            {
              icon: {
                type: 'sfSymbol',
                name: 'heart',
              },
              onPress: () => Alert.alert('Favorite button pressed'),
            },
            {
              customView: (
                <HeaderButton onPress={() => Alert.alert('Follow pressed')}>
                  <MaterialCommunityIcons
                    name="account-plus-outline"
                    size={28}
                  />
                </HeaderButton>
              ),
            },
            {
              icon: {
                type: 'sfSymbol',
                name: 'ellipsis',
              },
              menu: {
                label: 'Article options',
                items: [
                  {
                    type: 'action',
                    label: 'Share',
                    onPress: () => Alert.alert('Share pressed'),
                  },
                  {
                    type: 'action',
                    label: 'Delete',
                    attributes: 'disabled',
                    onPress: () => Alert.alert('Delete pressed'),
                  },
                  {
                    type: 'action',
                    label: 'Report',
                    attributes: 'destructive',
                    onPress: () => Alert.alert('Report pressed'),
                  },
                  {
                    type: 'submenu',
                    label: 'View history',
                    items: [
                      {
                        type: 'action',
                        label: 'Version 1.0',
                        icon: {
                          type: 'sfSymbol',
                          name: 'checkmark',
                        },
                        onPress: () => Alert.alert('View version 1.0'),
                      },
                      {
                        type: 'action',
                        label: 'Version 0.9',
                        onPress: () => Alert.alert('View version 0.9'),
                      },
                    ],
                  },
                ],
              },
            },
          ];

          return {
            title: `Article by ${route.params?.author ?? 'Unknown'}`,
            headerLargeTitle: true,
            headerLargeTitleShadowVisible: false,
            headerLeftItems: () => leftItems,
            headerRightItems: () => rightItems,
          };
        }}
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
  container: {
    flex: 1,
  },
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
