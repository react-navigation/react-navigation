import {
  createBottomTabNavigator,
  createBottomTabScreen,
} from '@react-navigation/bottom-tabs';
import {
  createDrawerNavigator,
  createDrawerScreen,
  DrawerToggleButton,
} from '@react-navigation/drawer';
import { Button, type Icon, Text } from '@react-navigation/elements';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import {
  createNativeStackNavigator,
  createNativeStackScreen,
} from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { Platform, StyleSheet, View } from 'react-native';

import iconBookUser from '../../assets/icons/book-user.png';
import iconLayoutDashboard from '../../assets/icons/layout-dashboard.png';
import iconNewspaper from '../../assets/icons/newspaper.png';

/**
 * Repro for Android Fabric mid-animation drawer flash (#12137 / PR #13187).
 *
 * Nesting: Drawer → Bottom Tabs → Native Stack (per tab).
 * Red sceneStyle makes a remount flash obvious on the light content.
 *
 * Test plan (Android, New Architecture):
 * 1. Examples → Drawer → Nested Tabs + Stack
 * 2. Open/close the drawer frequently (~10–20×) via hamburger, edge swipe,
 *    and overlay tap
 * 3. On `main` (without the settled hitSlop fix): brief RED flash on the
 *    screen (~2 in 4–5 toggles on mid-range; rarer on newer/faster devices).
 *    Bottom tabs should not flash.
 * 4. On this PR: same steps — no RED flash
 */
const FLASH_RED = '#FF1744';
const HEADER_BG = '#FFFFFF';
const TAB_BAR_BG = '#FFFFFF';
const DRAWER_BG = '#FFFFFF';
const HOME_BG = '#C8E6C9';
const FEED_BG = '#BBDEFB';
const PROFILE_BG = '#FFE0B2';
const DETAILS_BG = '#FFF9C4';
const TEXT = '#212121';

const homeIcon = Platform.select<Icon>({
  ios: { type: 'sfSymbol', name: 'house' },
  android: { type: 'materialSymbol', name: 'home' },
  default: { type: 'image', source: iconLayoutDashboard },
})!;

const feedIcon = Platform.select<Icon>({
  ios: { type: 'sfSymbol', name: 'newspaper' },
  android: { type: 'materialSymbol', name: 'newspaper' },
  default: { type: 'image', source: iconNewspaper },
})!;

const profileIcon = Platform.select<Icon>({
  ios: { type: 'sfSymbol', name: 'person' },
  android: { type: 'materialSymbol', name: 'person' },
  default: { type: 'image', source: iconBookUser },
})!;

const appsIcon = Platform.select<Icon>({
  ios: { type: 'sfSymbol', name: 'square.grid.2x2' },
  android: { type: 'materialSymbol', name: 'apps' },
  default: { type: 'materialSymbol', name: 'apps' },
})!;

function LightStatusBar() {
  const isFocused = useIsFocused();
  return isFocused ? <StatusBar style="dark" /> : null;
}

function Scene({
  bg,
  title,
  subtitle,
  children,
}: {
  bg: string;
  title: string;
  subtitle: string;
  children?: React.ReactNode;
}) {
  return (
    <View style={[styles.scene, { backgroundColor: bg }]}>
      <LightStatusBar />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
      {children}
    </View>
  );
}

function NestedTabsHomeScreen() {
  const navigation = useNavigation('NestedTabsHome');

  return (
    <Scene
      bg={HOME_BG}
      title="HOME"
      subtitle="Open/close frequently (~10–20×). Without the fix: brief RED flash on the screen (~2 in 4–5 on mid-range; rarer on newer devices). Bottom tabs should not flash."
    >
      <Button
        variant="filled"
        onPress={() => navigation.navigate('NestedTabsDetails')}
      >
        Push Details
      </Button>
    </Scene>
  );
}

function NestedTabsDetailsScreen() {
  const navigation = useNavigation('NestedTabsDetails');

  return (
    <Scene
      bg={DETAILS_BG}
      title="DETAILS"
      subtitle="Stack under tabs under drawer."
    >
      <Button variant="tinted" onPress={() => navigation.goBack()}>
        Go back
      </Button>
    </Scene>
  );
}

function NestedTabsFeedScreen() {
  const navigation = useNavigation('NestedTabsFeed');

  return (
    <Scene
      bg={FEED_BG}
      title="FEED"
      subtitle="Open/close frequently (~10–20×). Without the fix: brief RED flash on the screen. Bottom tabs should not flash."
    >
      <Button
        variant="filled"
        onPress={() => navigation.navigate('NestedTabsFeedDetails')}
      >
        Push Details
      </Button>
    </Scene>
  );
}

function NestedTabsProfileScreen() {
  return (
    <Scene
      bg={PROFILE_BG}
      title="PROFILE"
      subtitle="Open/close frequently (~10–20×). Without the fix: brief RED flash on the screen. Bottom tabs should not flash."
    />
  );
}

const stackScreenOptions = {
  headerStyle: { backgroundColor: HEADER_BG },
  headerTintColor: TEXT,
  headerTitleStyle: { color: TEXT, fontWeight: '700' as const },
  contentStyle: { backgroundColor: FLASH_RED },
  statusBarStyle: 'dark' as const,
};

const drawerToggleLeft = () => <DrawerToggleButton tintColor={TEXT} />;

const NestedTabsHomeStack = createNativeStackNavigator({
  screenOptions: stackScreenOptions,
  screens: {
    NestedTabsHome: createNativeStackScreen({
      screen: NestedTabsHomeScreen,
      options: {
        title: 'Home',
        headerLeft: drawerToggleLeft,
      },
    }),
    NestedTabsDetails: createNativeStackScreen({
      screen: NestedTabsDetailsScreen,
      options: { title: 'Details' },
    }),
  },
});

const NestedTabsFeedStack = createNativeStackNavigator({
  screenOptions: stackScreenOptions,
  screens: {
    NestedTabsFeed: createNativeStackScreen({
      screen: NestedTabsFeedScreen,
      options: {
        title: 'Feed',
        headerLeft: drawerToggleLeft,
      },
    }),
    NestedTabsFeedDetails: createNativeStackScreen({
      screen: NestedTabsDetailsScreen,
      options: { title: 'Details' },
    }),
  },
});

const NestedTabsProfileStack = createNativeStackNavigator({
  screenOptions: stackScreenOptions,
  screens: {
    NestedTabsProfile: createNativeStackScreen({
      screen: NestedTabsProfileScreen,
      options: {
        title: 'Profile',
        headerLeft: drawerToggleLeft,
      },
    }),
  },
});

const NestedTabs = createBottomTabNavigator({
  screenOptions: {
    headerShown: false,
    sceneStyle: { backgroundColor: FLASH_RED },
    tabBarStyle: {
      backgroundColor: TAB_BAR_BG,
      borderTopColor: '#E0E0E0',
    },
    tabBarActiveTintColor: '#C62828',
    tabBarInactiveTintColor: '#757575',
  },
  screens: {
    NestedTabsHomeTab: createBottomTabScreen({
      screen: NestedTabsHomeStack,
      options: {
        title: 'Home',
        tabBarIcon: homeIcon,
      },
    }),
    NestedTabsFeedTab: createBottomTabScreen({
      screen: NestedTabsFeedStack,
      options: {
        title: 'Feed',
        tabBarIcon: feedIcon,
      },
    }),
    NestedTabsProfileTab: createBottomTabScreen({
      screen: NestedTabsProfileStack,
      options: {
        title: 'Profile',
        tabBarIcon: profileIcon,
      },
    }),
  },
});

const DrawerNestedTabsNavigator = createDrawerNavigator({
  screenOptions: {
    headerShown: false,
    drawerType: 'front',
    sceneStyle: { backgroundColor: FLASH_RED },
    drawerStyle: {
      width: 280,
      backgroundColor: DRAWER_BG,
    },
    overlayStyle: { backgroundColor: 'rgba(0,0,0,0.28)' },
    drawerActiveTintColor: '#C62828',
    drawerInactiveTintColor: '#616161',
  },
  screens: {
    NestedTabsMain: createDrawerScreen({
      screen: NestedTabs,
      options: {
        title: 'App',
        drawerIcon: appsIcon,
      },
    }),
  },
});

export const DrawerNestedTabs = {
  screen: DrawerNestedTabsNavigator,
  title: 'Drawer - Nested Tabs + Stack',
};

const styles = StyleSheet.create({
  scene: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    gap: 16,
  },
  title: {
    color: TEXT,
    fontSize: 28,
    fontWeight: '800',
  },
  subtitle: {
    color: TEXT,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 8,
  },
});
