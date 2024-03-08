import type {
  NavigatorScreenParams,
  PathConfigMap,
} from '@react-navigation/native';

import { AuthFlow } from './Screens/AuthFlow';
import { BottomTabs } from './Screens/BottomTabs';
import { NavigatorLayout } from './Screens/CustomLayout';
import { DrawerView } from './Screens/DrawerView';
import { DynamicTabs } from './Screens/DynamicTabs';
import { ScreenLayout } from './Screens/Layouts';
import { LinkComponent } from './Screens/LinkComponent';
import { LinkingScreen } from './Screens/LinkingScreen';
import { MasterDetail } from './Screens/MasterDetail';
import { MaterialTopTabsScreen } from './Screens/MaterialTopTabs';
import { MixedHeaderMode } from './Screens/MixedHeaderMode';
import { MixedStack } from './Screens/MixedStack';
import { ModalStack } from './Screens/ModalStack';
import { NativeStack } from './Screens/NativeStack';
import { NativeStackHeaderCustomization } from './Screens/NativeStackHeaderCustomization';
import { NativeStackPreventRemove } from './Screens/NativeStackPreventRemove';
import { SimpleStack } from './Screens/SimpleStack';
import { StackHeaderCustomization } from './Screens/StackHeaderCustomization';
import { StackPreloadFlow } from './Screens/StackPreloadFlow';
import { StackPreventRemove } from './Screens/StackPreventRemove';
import { StackTransparent } from './Screens/StackTransparent';
import { StaticScreen } from './Screens/Static';
import { TabPreloadFlow } from './Screens/TabPreloadFlow';
import { TabView } from './Screens/TabView';

export const SCREENS = {
  NativeStack,
  SimpleStack,
  ModalStack,
  MixedStack,
  MixedHeaderMode,
  StackTransparent,
  StackHeaderCustomization,
  NativeStackHeaderCustomization,
  BottomTabs,
  MaterialTopTabsScreen,
  DynamicTabs,
  MasterDetail,
  AuthFlow,
  ScreenLayout,
  NavigatorLayout,
  StackPreventRemove,
  NativeStackPreventRemove,
  LinkComponent,
  TabView,
  DrawerView,
  StaticScreen,
  LinkingScreen,
  StackPreloadFlow,
  TabPreloadFlow,
} as const satisfies {
  [key: string]: React.ComponentType<{}> & {
    title: string;
    linking: object;
    options?: object;
  };
};

type ExampleScreensParamList = {
  [Key in keyof typeof SCREENS]: (typeof SCREENS)[Key]['linking'] extends PathConfigMap<
    infer P
  >
    ? NavigatorScreenParams<P> | undefined
    : undefined;
};

export type RootDrawerParamList = {
  Examples: undefined;
};

export type RootStackParamList = ExampleScreensParamList & {
  Home: NavigatorScreenParams<RootDrawerParamList> | undefined;
  NotFound: undefined;
};

// Make the default RootParamList the same as the RootStackParamList
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
