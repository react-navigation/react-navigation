import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import {
  type BottomTabScreenProps,
  createExperimentalBottomTabNavigator,
  useBottomTabBarHeight,
} from '@react-navigation/bottom-tabs';
import { Button, useHeaderHeight } from '@react-navigation/elements';
import {
  type NavigatorScreenParams,
  type PathConfigMap,
  useIsFocused,
  useNavigation,
} from '@react-navigation/native';
import * as React from 'react';
import {
  type ColorValue,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

import { SystemBars } from '../edge-to-edge';
import { Albums } from '../Shared/Albums';
import { Contacts } from '../Shared/Contacts';

// const getTabBarIcon =
//   (name: React.ComponentProps<typeof MaterialCommunityIcons>['name']) =>
//   ({ color, size }: { color: ColorValue; size: number }) => (
//     <MaterialCommunityIcons name={name} color={color} size={size} />
//   );

// export type BottomTabParams = {
//   TabStack: NavigatorScreenParams<NativeStackParams>;
//   TabAlbums: undefined;
//   TabContacts: undefined;
//   TabChat: { count: number } | undefined;
// };

// const linking: PathConfigMap<BottomTabParams> = {
//   TabStack: {
//     path: 'stack',
//     screens: NativeStack.linking,
//   },
//   TabAlbums: 'albums',
//   TabContacts: 'contacts',
//   TabChat: 'chat',
// };

// const AlbumsScreen = () => {
//   const navigation =
//     useNavigation<BottomTabScreenProps<BottomTabParams>['navigation']>();
//   const headerHeight = useHeaderHeight();
//   const tabBarHeight = useBottomTabBarHeight();
//   const isFocused = useIsFocused();
//
//   return (
//     <>
//       {isFocused && Platform.OS === 'android' && <SystemBars style="light" />}
//       <ScrollView
//         contentContainerStyle={{
//           paddingTop: headerHeight,
//           paddingBottom: tabBarHeight,
//         }}
//       >
//         <View style={styles.buttons}>
//           <Button
//             variant="filled"
//             onPress={() => {
//               navigation.navigate('TabChat', { count: i++ });
//             }}
//           >
//             Go to Chat
//           </Button>
//           <Button variant="tinted" onPress={() => navigation.goBack()}>
//             Go back
//           </Button>
//         </View>
//         <Albums scrollEnabled={false} />
//       </ScrollView>
//     </>
//   );
// };

// let i = 1;
//
const Tab = createExperimentalBottomTabNavigator();
//
// const animations = ['none', 'fade', 'shift'] as const;
// const variants = ['material', 'uikit'] as const;

export function ExperimentalBottomTabs() {
  // const { showActionSheetWithOptions } = useActionSheet();
  // const { direction } = useLocale();
  //
  // const dimensions = useWindowDimensions();
  //
  // const [variant, setVariant] =
  //   React.useState<(typeof variants)[number]>('material');
  // const [animation, setAnimation] =
  //   React.useState<(typeof animations)[number]>('none');
  //
  // const [isCompact, setIsCompact] = React.useState(false);
  //
  // const isLargeScreen = dimensions.width >= 1024;

  return (
    <Tab.Navigator>
      <Tab.Screen name="TabAlbums" component={Albums} />
      <Tab.Screen name="TabContacts" component={Contacts} />
    </Tab.Navigator>
  );
}

ExperimentalBottomTabs.title = 'Experimental Bottom Tabs';
// ExperimentalBottomTabs.linking = linking;

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
