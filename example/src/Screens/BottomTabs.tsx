import { useActionSheet } from '@expo/react-native-action-sheet';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import {
  createBottomTabNavigator,
  TransitionPresets,
  useBottomTabBarHeight,
} from '@react-navigation/bottom-tabs';
import { HeaderBackButton, useHeaderHeight } from '@react-navigation/elements';
import {
  type NavigatorScreenParams,
  type ParamListBase,
  useIsFocused,
} from '@react-navigation/native';
import type { StackScreenProps } from '@react-navigation/stack';
import { BlurView } from 'expo-blur';
import * as React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import {
  Appbar,
  Button,
  Checkbox,
  FAB,
  IconButton,
  RadioButton,
} from 'react-native-paper';

import { Albums } from '../Shared/Albums';
import { Chat } from '../Shared/Chat';
import { Contacts } from '../Shared/Contacts';
import { SimpleStack, type SimpleStackParams } from './SimpleStack';

const getTabBarIcon =
  (name: React.ComponentProps<typeof MaterialCommunityIcons>['name']) =>
  ({ color, size }: { color: string; size: number }) => (
    <MaterialCommunityIcons name={name} color={color} size={size} />
  );

type BottomTabParams = {
  TabStack: NavigatorScreenParams<SimpleStackParams>;
  TabAlbums: undefined;
  TabContacts: undefined;
  TabChat: undefined;
};

const AlbumsScreen = () => {
  const headerHeight = useHeaderHeight();
  const tabBarHeight = useBottomTabBarHeight();
  const isFocused = useIsFocused();

  return (
    <>
      {isFocused && Platform.OS === 'android' && (
        <StatusBar barStyle="light-content" />
      )}
      <ScrollView
        contentContainerStyle={{
          paddingTop: headerHeight,
          paddingBottom: tabBarHeight,
        }}
      >
        <Albums scrollEnabled={false} />
      </ScrollView>
    </>
  );
};

const Tab = createBottomTabNavigator<BottomTabParams>();

const animations = {
  shifting: TransitionPresets.ShiftingTransition,
  fade: TransitionPresets.FadeTransition,
  none: null,
} as const;

const SettingsContext = React.createContext({
  openSettingsModal: false,
  tabBarWidth: 100,
  useTabBarWidthProps: false,
  setOpenSettingModal: (_isOpen: boolean) => {},
  setTabBarWidth: (_width: number) => {},
  setUseTabBarWidthProps: (_useProps: boolean) => {},
});

const SettingsFab = () => {
  const { setOpenSettingModal } = React.useContext(SettingsContext);

  return (
    // eslint-disable-next-line react/jsx-pascal-case
    <FAB
      style={styles.fab}
      small
      icon="cog"
      onPress={() => setOpenSettingModal(true)}
    />
  );
};

const SettingsModal = () => {
  const tabBarWidthOptions = [100, 150, 200];
  const {
    useTabBarWidthProps,
    setUseTabBarWidthProps,
    openSettingsModal,
    setOpenSettingModal,
    tabBarWidth,
    setTabBarWidth,
  } = React.useContext(SettingsContext);
  if (!openSettingsModal) {
    return <></>;
  }
  return (
    <View style={styles.settingsModal}>
      <View style={styles.settingsModalSurface}>
        <Button onPress={() => setOpenSettingModal(false)}>
          Close Settings Modal
        </Button>
        <View style={styles.settingsModalSurfaceRow}>
          <Text style={{ fontSize: 18 }}>
            use tabBarWidth Props to set the tab bar width with callback
          </Text>
          <Checkbox
            status={useTabBarWidthProps ? 'checked' : 'unchecked'}
            onPress={() => {
              setUseTabBarWidthProps(!useTabBarWidthProps);
            }}
          />
        </View>
        <View>
          {tabBarWidthOptions.map((number) => {
            return (
              <View key={number} style={styles.settingsModalSurfaceRow}>
                <Text>{number}</Text>
                <RadioButton
                  disabled={!useTabBarWidthProps}
                  value={number.toString()}
                  status={tabBarWidth === number ? 'checked' : 'unchecked'}
                  onPress={() => setTabBarWidth(number)}
                />
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  settingsModal: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.8)',
    zIndex: 999,
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingsModalSurface: {
    width: '50%',
    height: '50%',
    backgroundColor: 'white',
  },
  settingsModalSurfaceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 10,
  },
});

export function BottomTabs({
  navigation,
}: StackScreenProps<ParamListBase, string>) {
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const { showActionSheetWithOptions } = useActionSheet();

  const dimensions = useWindowDimensions();

  const [animation, setAnimation] =
    React.useState<keyof typeof animations>('none');
  const [isCompact, setIsCompact] = React.useState(false);

  const isLargeScreen = dimensions.width >= 1024;

  const [openSettingsModal, setOpenSettingModal] = React.useState(false);
  const [tabBarWidth, setTabBarWidth] = React.useState(100);
  const [useTabBarWidthProps, setUseTabBarWidthProps] = React.useState(false);

  return (
    <SettingsContext.Provider
      value={{
        openSettingsModal,
        setOpenSettingModal,
        tabBarWidth,
        setTabBarWidth,
        useTabBarWidthProps,
        setUseTabBarWidthProps,
      }}
    >
      <Tab.Navigator
        screenOptions={{
          headerLeft: (props) => (
            <HeaderBackButton {...props} onPress={navigation.goBack} />
          ),
          headerRight: ({ tintColor }) => (
            <Appbar.Action
              icon={animation === 'none' ? 'heart-outline' : 'heart'}
              color={tintColor}
              onPress={() => {
                const options = Object.keys(
                  animations
                ) as (keyof typeof animations)[];

                showActionSheetWithOptions(
                  {
                    options: options.map((option) => {
                      if (option === animation) {
                        return `${option} (current)`;
                      }

                      return option;
                    }),
                  },
                  (index) => {
                    if (index != null) {
                      setAnimation(options[index]);
                    }
                  }
                );
              }}
            />
          ),
          tabBarWidth: useTabBarWidthProps ? () => tabBarWidth : undefined,
          tabBarPosition: isLargeScreen ? 'left' : 'bottom',
          tabBarLabelPosition:
            isLargeScreen && isCompact ? 'below-icon' : undefined,
          ...animations[animation],
        }}
      >
        <Tab.Screen
          name="TabStack"
          component={SimpleStack}
          options={{
            title: 'Article',
            tabBarIcon: getTabBarIcon('file-document'),
          }}
        />
        <Tab.Screen
          name="TabChat"
          component={Chat}
          options={{
            tabBarLabel: 'Chat',
            tabBarIcon: getTabBarIcon('message-reply'),
            tabBarBadge: 2,
          }}
        />
        <Tab.Screen
          name="TabContacts"
          component={Contacts}
          options={{
            title: 'Contacts',
            tabBarIcon: getTabBarIcon('contacts'),
          }}
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
            tabBarIcon: getTabBarIcon('image-album'),
            tabBarInactiveTintColor: 'rgba(255, 255, 255, 0.5)',
            tabBarActiveTintColor: '#fff',
            tabBarStyle: {
              position: isLargeScreen ? undefined : 'absolute',
              borderColor: 'rgba(0, 0, 0, .2)',
            },
            tabBarBackground: () => (
              <>
                {isLargeScreen && (
                  <Image
                    source={require('../../assets/album-art-03.jpg')}
                    resizeMode="cover"
                    style={{
                      ...StyleSheet.absoluteFillObject,
                      // Override default size of the image
                      height: undefined,
                      width: undefined,
                    }}
                  />
                )}
                <BlurView
                  tint="dark"
                  intensity={100}
                  style={{
                    ...StyleSheet.absoluteFillObject,
                    right: isLargeScreen
                      ? // Offset for right border of the sidebar
                        -StyleSheet.hairlineWidth
                      : 0,
                  }}
                />
              </>
            ),
          }}
        />
      </Tab.Navigator>
      {isLargeScreen ? (
        <IconButton
          icon={isCompact ? 'chevron-double-right' : 'chevron-double-left'}
          onPress={() => setIsCompact(!isCompact)}
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
          }}
        />
      ) : null}
      <SettingsFab />
      <SettingsModal />
    </SettingsContext.Provider>
  );
}
