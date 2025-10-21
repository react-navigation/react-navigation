import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import {
  type BottomTabScreenProps,
  createExperimentalBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import {
  Button,
  PlatformPressable,
  useHeaderHeight,
} from '@react-navigation/elements';
import {
  type NavigatorScreenParams,
  type PathConfigMap,
  useIsFocused,
  useNavigation,
} from '@react-navigation/native';
import * as React from 'react';
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';

import iconBookUser from '../../assets/icons/book-user.png';
import iconHeart from '../../assets/icons/heart.png';
import iconMusic from '../../assets/icons/music.png';
import iconNewspaper from '../../assets/icons/newspaper.png';
import { SystemBars } from '../edge-to-edge';
import { Albums } from '../Shared/Albums';
import { Contacts } from '../Shared/Contacts';
import { NativeStack, type NativeStackParams } from './NativeStack';

export type ExperimentalBottomTabParams = {
  TabStack: NavigatorScreenParams<NativeStackParams>;
  TabAlbums: undefined;
  TabContacts: { count: number };
  TabExtra: undefined;
};

const linking: PathConfigMap<ExperimentalBottomTabParams> = {
  TabStack: {
    path: 'stack',
    screens: NativeStack.linking,
  },
  TabAlbums: 'albums',
  TabContacts: 'contacts',
};

const AlbumsScreen = () => {
  const navigation =
    useNavigation<
      BottomTabScreenProps<ExperimentalBottomTabParams>['navigation']
    >();
  const headerHeight = useHeaderHeight();
  const isFocused = useIsFocused();

  return (
    <>
      {isFocused && Platform.OS === 'android' && <SystemBars style="light" />}
      <ScrollView
        automaticallyAdjustContentInsets
        contentContainerStyle={{
          paddingTop: headerHeight,
        }}
      >
        <View style={styles.buttons}>
          <Button
            variant="filled"
            onPress={() => {
              navigation.navigate('TabContacts', { count: i++ });
            }}
          >
            Go to Contacts
          </Button>
          <Button variant="tinted" onPress={() => navigation.goBack()}>
            Go back
          </Button>
        </View>
        <Albums scrollEnabled={false} />
      </ScrollView>
    </>
  );
};

let i = 1;

const Tab = createExperimentalBottomTabNavigator<ExperimentalBottomTabParams>();

export function ExperimentalBottomTabs() {
  const dimensions = useWindowDimensions();

  const [isCompact, setIsCompact] = React.useState(false);

  const isLargeScreen = dimensions.width >= 1024;

  return (
    <>
      <Tab.Navigator backBehavior="fullHistory">
        <Tab.Screen
          name="TabStack"
          component={NativeStack}
          options={{
            popToTopOnBlur: true,
            title: 'Article',
            tabBarIcon: {
              templateSource: iconNewspaper,
            },
          }}
        />
        <Tab.Screen
          name="TabContacts"
          component={Contacts}
          initialParams={{ count: i }}
          options={({ route }) => ({
            title: 'Contacts',
            tabBarIcon: Platform.select({
              ios: {
                sfSymbolName: 'person.2',
              },
              default: {
                templateSource: iconBookUser,
              },
            }),
            tabBarBadge: route.params?.count,
          })}
        />
        <Tab.Screen
          name="TabAlbums"
          component={AlbumsScreen}
          options={{
            title: 'Albums',
            tabBarIcon: {
              templateSource: iconMusic,
            },
            tabBarInactiveTintColor: 'rgba(255, 255, 255, 0.5)',
            tabBarActiveTintColor: '#fff',
            tabBarStyle: {
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
            },
          }}
        />
        <Tab.Screen
          name="TabExtra"
          options={{
            tabBarSystemItem: 'search',
            tabBarLabel: 'Favorites',
            tabBarIcon: Platform.select({
              ios: {
                sfSymbolName: 'heart',
              },
              default: {
                templateSource: iconHeart,
              },
            }),
          }}
          listeners={{
            tabPress: (e) => {
              e.preventDefault();
              Alert.alert('Extra Action', 'Favorites pressed.');
            },
          }}
        >
          {() => null}
        </Tab.Screen>
      </Tab.Navigator>
      {isLargeScreen ? (
        <PlatformPressable
          onPress={() => setIsCompact(!isCompact)}
          style={{
            position: 'absolute',
            bottom: 0,
            start: 0,
            padding: 16,
          }}
        >
          <MaterialCommunityIcons
            name={isCompact ? 'chevron-double-right' : 'chevron-double-left'}
            size={24}
            color="black"
          />
        </PlatformPressable>
      ) : null}
    </>
  );
}

ExperimentalBottomTabs.title = 'Experimental Bottom Tabs';
ExperimentalBottomTabs.linking = linking;

const styles = StyleSheet.create({
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginEnd: 16,
  },
  buttons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    margin: 12,
  },
});
