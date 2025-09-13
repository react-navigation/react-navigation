import { createExperimentalBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { type PathConfigMap } from '@react-navigation/native';
import { Platform } from 'react-native';

import { Albums } from '../Shared/Albums';
import { Contacts } from '../Shared/Contacts';

// const getTabBarIcon =
//   (name: React.ComponentProps<typeof MaterialCommunityIcons>['name']) =>
//   ({ color, size }: { color: ColorValue; size: number }) => (
//     <MaterialCommunityIcons name={name} color={color} size={size} />
//   );

export type BottomTabParams = {
  TabAlbums: undefined;
  TabContacts: undefined;
};

const linking: PathConfigMap<BottomTabParams> = {
  TabAlbums: 'albums',
  TabContacts: 'contacts',
};

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
      <Tab.Screen
        name="TabAlbums"
        component={Albums}
        options={{
          tabBarIcon: Platform.select({
            // ios: { sfSymbolName: 'newspaper' },
            ios: 'star',
            android: 'star_on',
            // android: { name: 'newspaper' },
          }),
          tabBarBadge: 'Hi',
          tabBarBadgeStyle: {
            backgroundColor: 'blue',
            textColor: 'yellow',
            // color: 'white',
          },
          tabBarActiveTintColor: 'green',
          tabBarStyle: {
            backgroundColor: 'pink',
          },
        }}
      />
      <Tab.Screen
        name="TabContacts"
        component={Contacts}
        options={{
          tabBarIcon: Platform.select({
            // ios: { sfSymbolName: 'newspaper' },
            ios: 'star',
            android: 'star_on',
            // android: { name: 'newspaper' },
          }),
        }}
      />
    </Tab.Navigator>
  );
}

ExperimentalBottomTabs.title = 'Experimental Bottom Tabs';
ExperimentalBottomTabs.linking = linking;
