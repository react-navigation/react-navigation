import { MaterialDesignIcons } from '@react-native-vector-icons/material-design-icons';
import {
  Button,
  HeaderButton,
  Text,
  useHeaderHeight,
} from '@react-navigation/elements';
import { useNavigation, useRoute, useTheme } from '@react-navigation/native';
import {
  createNativeStackNavigator,
  createNativeStackScreen,
  type NativeStackHeaderItem,
  useAnimatedHeaderHeight,
} from '@react-navigation/native-stack';
import * as React from 'react';
import {
  Alert,
  Animated,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

import messageCircle from '../../assets/icons/message-circle.png';
import userRoundPlus from '../../assets/icons/user-round-plus.png';
import { COMMON_LINKING_CONFIG } from '../constants';
import { Albums } from '../Shared/Albums';
import { Article } from '../Shared/Article';
import { Contacts } from '../Shared/Contacts';
import { NewsFeed } from '../Shared/NewsFeed';

const scrollEnabled = Platform.select({ web: true, default: false });

const ArticleScreen = () => {
  const navigation = useNavigation('Article');
  const route = useRoute('Article');

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
      <HeaderHeightView hasOffset={Platform.OS === 'ios'} />
    </View>
  );
};

const NewsFeedScreen = () => {
  const route = useRoute('NewsFeed');
  const navigation = useNavigation('NewsFeed');

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
      <HeaderHeightView hasOffset={false} />
    </View>
  );
};

const ContactsScreen = () => {
  const navigation = useNavigation('Contacts');

  const [query, setQuery] = React.useState('');

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerSearchBarOptions: {
        placeholder: 'Filter contacts',
        placement: 'inline',
        onChange: (e) => {
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

const AlbumsScreen = () => {
  const navigation = useNavigation('Albums');

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

const HeaderHeightView = ({ hasOffset }: { hasOffset: boolean }) => {
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

const NativeStackNavigator = createNativeStackNavigator({
  screens: {
    Article: createNativeStackScreen({
      screen: ArticleScreen,
      options: ({ route, navigation }) => {
        const leftItems: NativeStackHeaderItem[] = [
          {
            type: 'button',
            label: 'Back',
            onPress: () => navigation.goBack(),
          },
        ];

        const rightItems: NativeStackHeaderItem[] = [
          {
            type: 'button',
            label: 'Follow',
            icon: {
              type: 'image',
              source: userRoundPlus,
            },
            onPress: () => Alert.alert('Follow button pressed'),
          },
          {
            type: 'button',
            label: 'Favorite',
            icon: {
              type: 'sfSymbol',
              name: 'heart',
            },
            onPress: () => Alert.alert('Favorite button pressed'),
          },
          {
            type: 'menu',
            label: 'Options',
            icon: {
              type: 'sfSymbol',
              name: 'ellipsis',
            },
            badge: {
              value: 3,
            },
            menu: {
              title: 'Article options',
              items: [
                {
                  type: 'action',
                  label: 'Share',
                  icon: {
                    type: 'sfSymbol',
                    name: 'square.and.arrow.up',
                  },
                  onPress: () => Alert.alert('Share pressed'),
                },
                {
                  type: 'action',
                  label: 'Delete',
                  icon: {
                    type: 'sfSymbol',
                    name: 'trash',
                  },
                  destructive: true,
                  onPress: () => Alert.alert('Delete pressed'),
                },
                {
                  type: 'action',
                  label: 'Report',
                  icon: {
                    type: 'sfSymbol',
                    name: 'flag',
                  },
                  destructive: true,
                  onPress: () => Alert.alert('Report pressed'),
                },
                {
                  type: 'action',
                  label: 'Message',
                  icon: {
                    type: 'image',
                    source: Platform.select({
                      // Avoid calling `Image.resolveAssetSource` on Web to prevent crash
                      get ios() {
                        return {
                          ...Image.resolveAssetSource(messageCircle),
                          scale:
                            Image.resolveAssetSource(messageCircle).scale * 1.4,
                        };
                      },
                      default: messageCircle,
                    }),
                  },
                  onPress: () => Alert.alert('Message pressed'),
                },
                {
                  type: 'submenu',
                  label: 'View history',
                  icon: {
                    type: 'sfSymbol',
                    name: 'clock',
                  },
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
                {
                  label: 'Theme',
                  inline: true,
                  destructive: true,
                  icon: { type: 'sfSymbol', name: 'star' },
                  type: 'submenu',
                  items: [
                    {
                      label: 'Auto',
                      state: 'mixed',
                      type: 'action',
                      description: 'Adapts to system settings',
                      onPress: () => Alert.alert('Sub Action 1 pressed'),
                      destructive: true,
                      keepsMenuPresented: true,
                      discoverabilityLabel: 'Sub Action 1',
                    },
                    {
                      label: 'Light',
                      type: 'action',
                      onPress: () => Alert.alert('Light theme selected'),
                    },
                    {
                      label: 'Dark',
                      type: 'action',
                      onPress: () => Alert.alert('Dark theme selected'),
                    },
                  ],
                },
                {
                  label: 'Text Size',
                  inline: true,
                  layout: 'palette',
                  destructive: true,
                  type: 'submenu',
                  items: [
                    {
                      label: 'Small',
                      icon: {
                        type: 'sfSymbol',
                        name: 'textformat.size.smaller',
                      },
                      type: 'action',
                      onPress: () => Alert.alert('Small text selected'),
                    },
                    {
                      label: 'Medium',
                      state: 'on',
                      icon: { type: 'sfSymbol', name: 'textformat.size' },
                      type: 'action',
                      onPress: () => Alert.alert('Medium text selected'),
                    },
                    {
                      label: 'Large',
                      icon: {
                        type: 'sfSymbol',
                        name: 'textformat.size.larger',
                      },
                      type: 'action',
                      onPress: () => Alert.alert('Large text selected'),
                    },
                  ],
                },
              ],
            },
          },
          {
            type: 'custom',
            element: (
              <HeaderButton onPress={() => Alert.alert('Info pressed')}>
                <MaterialDesignIcons name="information-outline" size={28} />
              </HeaderButton>
            ),
          },
        ];

        return {
          title: `Article by ${route.params?.author ?? 'Unknown'}`,
          headerLargeTitleEnabled: true,
          headerLargeTitleShadowVisible: false,
          headerRight: ({ tintColor }) => (
            <HeaderButton
              onPress={() => Alert.alert('Favorite button pressed')}
            >
              <MaterialDesignIcons name="heart" size={24} color={tintColor} />
            </HeaderButton>
          ),
          unstable_headerLeftItems: () => leftItems,
          unstable_headerRightItems: () => rightItems,
        };
      },
      initialParams: { author: 'Gandalf' },
      linking: COMMON_LINKING_CONFIG.Article,
    }),
    NewsFeed: createNativeStackScreen({
      screen: NewsFeedScreen,
      options: {
        title: 'Feed',
        fullScreenGestureEnabled: true,
      },
      linking: COMMON_LINKING_CONFIG.NewsFeed,
    }),
    Contacts: createNativeStackScreen({
      screen: ContactsScreen,
      options: {
        headerSearchBarOptions: {
          placeholder: 'Filter contacts',
        },
      },
      linking: 'contacts',
    }),
    Albums: createNativeStackScreen({
      screen: AlbumsScreen,
      options: ({ theme }) => ({
        title: 'Albums',
        presentation: 'modal',
        headerTransparent: true,
        headerBlurEffect: 'light',
        headerStyle: {
          backgroundColor: Platform.select({
            // Add a background color since Android doesn't support blur effect
            android: theme.colors.card,
            default: 'transparent',
          }),
        },
      }),
      linking: 'albums',
    }),
  },
});

export const NativeStack = {
  screen: NativeStackNavigator,
  title: 'Native Stack - Basic',
  options: {
    gestureEnabled: false,
  },
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
