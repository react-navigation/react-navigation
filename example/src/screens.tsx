import type { StaticConfig } from '@react-navigation/native';

import { ActivityModes } from './Screens/ActivityModes';
import { AuthFlow } from './Screens/AuthFlow';
import { BottomTabs } from './Screens/BottomTabs';
import { BottomTabsDynamic } from './Screens/BottomTabsDynamic';
import { BottomTabsFullHistory } from './Screens/BottomTabsFullHistory';
import { BottomTabsPreloadFlow } from './Screens/BottomTabsPreloadFlow';
import { ComponentsHeaders } from './Screens/ComponentsHeaders';
import { ComponentsLink } from './Screens/ComponentsLink';
import { ComponentsMaterialSymbols } from './Screens/ComponentsMaterialSymbols';
import { ComponentsSFSymbols } from './Screens/ComponentsSFSymbols';
import { DrawerMasterDetail } from './Screens/DrawerMasterDetail';
import { LibrariesDrawerLayout } from './Screens/LibrariesDrawerLayout';
import { LibrariesTabView } from './Screens/LibrariesTabView';
import { MaterialTopTabsBasic } from './Screens/MaterialTopTabs';
import { NativeBottomTabs } from './Screens/NativeBottomTabs';
import { NativeBottomTabsCustomTabBar } from './Screens/NativeBottomTabsCustomTabBar';
import { NativeStack } from './Screens/NativeStack';
import { NativeStackCardModal } from './Screens/NativeStackCardModal';
import { NativeStackFormSheet } from './Screens/NativeStackFormSheet';
import { NativeStackHeaderCustomization } from './Screens/NativeStackHeaderCustomization';
import { NativeStackPreloadFlow } from './Screens/NativeStackPreloadFlow';
import { NativeStackPreventRemove } from './Screens/NativeStackPreventRemove';
import { NavigatorLayout } from './Screens/NavigatorLayout';
import { ScreenLayout } from './Screens/ScreenLayout';
import { StackBasic } from './Screens/StackBasic';
import { StackCardModal } from './Screens/StackCardModal';
import { StackFloatScreenHeader } from './Screens/StackFloatScreenHeader';
import { StackHeaderCustomization } from './Screens/StackHeaderCustomization';
import { StackModal } from './Screens/StackModal';
import { StackPreloadFlow } from './Screens/StackPreloadFlow';
import { StackPreventRemove } from './Screens/StackPreventRemove';
import { StackTransparentModal } from './Screens/StackTransparentModal';
import { StaticConfig as StaticConfigScreen } from './Screens/StaticConfig';

export const SCREENS = {
  NativeStack,
  NativeStackCardModal,
  NativeStackFormSheet,
  NativeStackHeaderCustomization,
  NativeStackPreloadFlow,
  NativeStackPreventRemove,
  StackBasic,
  StackCardModal,
  StackFloatScreenHeader,
  StackHeaderCustomization,
  StackModal,
  StackPreloadFlow,
  StackPreventRemove,
  StackTransparentModal,
  NativeBottomTabs,
  NativeBottomTabsCustomTabBar,
  BottomTabs,
  BottomTabsDynamic,
  BottomTabsFullHistory,
  BottomTabsPreloadFlow,
  DrawerMasterDetail,
  MaterialTopTabsBasic,
  LibrariesDrawerLayout,
  LibrariesTabView,
  ComponentsHeaders,
  ComponentsLink,
  ComponentsMaterialSymbols,
  ComponentsSFSymbols,
  AuthFlow,
  NavigatorLayout,
  ScreenLayout,
  StaticConfigScreen,
  ActivityModes,
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
