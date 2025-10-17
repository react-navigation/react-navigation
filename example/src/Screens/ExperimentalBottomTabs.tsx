import { useActionSheet } from '@expo/react-native-action-sheet';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import {
  type BottomTabScreenProps,
  createExperimentalBottomTabNavigator,
  type ExperimentalBottomTabScreenProps,
} from '@react-navigation/bottom-tabs';
import {
  Button,
  HeaderBackButton,
  HeaderButton,
  PlatformPressable,
  useHeaderHeight,
} from '@react-navigation/elements';
import {
  type NavigatorScreenParams,
  type PathConfigMap,
  useIsFocused,
  useLocale,
  useNavigation,
} from '@react-navigation/native';
import { BlurView } from 'expo-blur';
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
// eslint-disable-next-line import-x/extensions
import iconMusic from '../../assets/variableIcons/music.png';
// eslint-disable-next-line import-x/extensions
import iconNewspaper from '../../assets/variableIcons/newspaper.png';
import { SystemBars } from '../edge-to-edge';
import { Albums } from '../Shared/Albums';
import { Contacts } from '../Shared/Contacts';
import { NativeStack, type NativeStackParams } from './NativeStack';

export type ExperimentalBottomTabParams = {
  TabStack: NavigatorScreenParams<NativeStackParams>;
  TabAlbums: undefined;
  TabContacts: { count: number };
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

const animations = ['none', 'fade', 'shift'] as const;
const variants = ['material', 'uikit'] as const;

export function ExperimentalBottomTabs() {
  const { showActionSheetWithOptions } = useActionSheet();
  const { direction } = useLocale();

  const dimensions = useWindowDimensions();

  const [variant, setVariant] =
    React.useState<(typeof variants)[number]>('material');
  const [animation, setAnimation] =
    React.useState<(typeof animations)[number]>('none');

  const [isCompact, setIsCompact] = React.useState(false);

  const isLargeScreen = dimensions.width >= 1024;

  return (
    <>
      <Tab.Navigator
        backBehavior="fullHistory"
        tabBarExtraItem={{
          role: 'search',
          icon: {
            sfSymbolName: 'heart',
          },
          onPress: () => {
            Alert.alert('Extra button pressed');
          },
        }}
        screenOptions={({
          navigation,
        }: ExperimentalBottomTabScreenProps<ExperimentalBottomTabParams>) => ({
          headerLeft: (props) => (
            <HeaderBackButton {...props} onPress={navigation.goBack} />
          ),
          headerRight: ({ tintColor }) => (
            <View style={styles.headerRight}>
              <HeaderButton
                onPress={() => {
                  showActionSheetWithOptions(
                    {
                      options: variants.map((option) => {
                        if (option === variant) {
                          return `${option} (current)`;
                        }

                        return option;
                      }),
                    },
                    (index) => {
                      if (index != null) {
                        setVariant(variants[index]);
                      }
                    }
                  );
                }}
              >
                <MaterialCommunityIcons
                  name={variant === 'uikit' ? 'ballot-outline' : 'ballot'}
                  size={24}
                  color={tintColor}
                />
              </HeaderButton>
              <HeaderButton
                onPress={() => {
                  showActionSheetWithOptions(
                    {
                      options: animations.map((option) => {
                        if (option === animation) {
                          return `${option} (current)`;
                        }

                        return option;
                      }),
                    },
                    (index) => {
                      if (index != null) {
                        setAnimation(animations[index]);
                      }
                    }
                  );
                }}
              >
                <MaterialCommunityIcons
                  name={
                    animation === 'none' ? 'movie-open-outline' : 'movie-open'
                  }
                  size={24}
                  color={tintColor}
                />
              </HeaderButton>
            </View>
          ),
          tabBarPosition: isLargeScreen
            ? direction === 'ltr'
              ? 'left'
              : 'right'
            : 'bottom',
          tabBarVariant: isLargeScreen ? variant : 'uikit',
          tabBarLabelPosition:
            isLargeScreen && isCompact && variant !== 'uikit'
              ? 'below-icon'
              : undefined,
          animation,
        })}
      >
        <Tab.Screen
          name="TabStack"
          component={NativeStack}
          options={{
            popToTopOnBlur: true,
            title: 'Article',
            headerShown: false,
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
            headerTintColor: '#fff',
            headerTransparent: true,
            headerBackground: () => (
              <BlurView
                tint="dark"
                intensity={100}
                style={StyleSheet.absoluteFill}
              />
            ),
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
