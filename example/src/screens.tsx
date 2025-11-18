import type { StaticConfig } from '@react-navigation/native';

import { AuthFlow } from './Screens/AuthFlow';
import { BottomTabs } from './Screens/BottomTabs';
import { NavigatorLayout } from './Screens/CustomLayout';
import { DrawerView } from './Screens/DrawerView';
import { DynamicTabs } from './Screens/DynamicTabs';
import { FullHistoryTabs } from './Screens/FullHistoryTabs';
import { Headers } from './Screens/Headers';
import { ScreenLayout } from './Screens/Layouts';
import { LinkComponent } from './Screens/LinkComponent';
import { MasterDetail } from './Screens/MasterDetail';
import { MaterialTopTabsScreen } from './Screens/MaterialTopTabs';
import { MixedHeaderMode } from './Screens/MixedHeaderMode';
import { MixedNativeStack } from './Screens/MixedNativeStack';
import { MixedStack } from './Screens/MixedStack';
import { ModalStack } from './Screens/ModalStack';
import { NativeBottomTabs } from './Screens/NativeBottomTabs';
import { NativeStack } from './Screens/NativeStack';
import { NativeStackHeaderCustomization } from './Screens/NativeStackHeaderCustomization';
import { NativeStackPreloadFlow } from './Screens/NativeStackPreloadFlow';
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
  MixedNativeStack,
  MixedHeaderMode,
  StackTransparent,
  StackHeaderCustomization,
  NativeStackHeaderCustomization,
  Headers,
  BottomTabs,
  NativeBottomTabs,
  MaterialTopTabsScreen,
  DynamicTabs,
  FullHistoryTabs,
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
  StackPreloadFlow,
  TabPreloadFlow,
  NativeStackPreloadFlow,
} as const satisfies {
  [key: string]:
    | (React.ComponentType<{ route: any }> & {
        title: string;
        linking: object | undefined;
        options?: object;
      })
    | {
        title: string;
        screen: { config: StaticConfig<any> };
      };
};
