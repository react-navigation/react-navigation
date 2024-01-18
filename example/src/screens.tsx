import type {
  NavigatorScreenParams,
  PathConfigMap,
} from '@react-navigation/native';

import { AuthFlow, authLinking } from './Screens/AuthFlow';
import { bottomTabLinking, BottomTabs } from './Screens/BottomTabs';
import { CustomLayout, customLayoutLinking } from './Screens/CustomLayout';
import { DrawerView } from './Screens/DrawerView';
import { dynamicBottomTabLinking, DynamicTabs } from './Screens/DynamicTabs';
import { LayoutsStack, layoutsStackLinking } from './Screens/Layouts';
import {
  LinkComponent,
  linkComponentDemoLinking,
} from './Screens/LinkComponent';
import { LinkingScreen, linkingStackLinking } from './Screens/LinkingScreen';
import { MasterDetail, masterDetailLinking } from './Screens/MasterDetail';
import {
  materialTopTabLinking,
  MaterialTopTabsScreen,
} from './Screens/MaterialTopTabs';
import {
  MixedHeaderMode,
  mixedHeaderStackLinking,
} from './Screens/MixedHeaderMode';
import { MixedStack, mixedStackLinking } from './Screens/MixedStack';
import { ModalStack, modalStackLinking } from './Screens/ModalStack';
import { NativeStack, nativeStackLinking } from './Screens/NativeStack';
import {
  nativeHeaderCustomizationStackLinking,
  NativeStackHeaderCustomization,
} from './Screens/NativeStackHeaderCustomization';
import {
  nativePreventRemoveLinking,
  NativeStackPreventRemove,
} from './Screens/NativeStackPreventRemove';
import { SimpleStack, simpleStackLinking } from './Screens/SimpleStack';
import {
  headerCustomizationStackLinking,
  StackHeaderCustomization,
} from './Screens/StackHeaderCustomization';
import {
  preloadStackLinking,
  StackPreloadFlow,
} from './Screens/StackPreloadFlow';
import {
  preventRemoveLinking,
  StackPreventRemove,
} from './Screens/StackPreventRemove';
import {
  StackTransparent,
  transparentStackLinking,
} from './Screens/StackTransparent';
import { StaticScreen } from './Screens/Static';
import {
  preloadBottomTabsLinking,
  TabPreloadFlow,
} from './Screens/TabPreloadFlow';
import { TabView, tabViewStackLinking } from './Screens/TabView';

export const SCREENS = {
  NativeStack: {
    title: 'Native Stack',
    component: NativeStack,
    linking: nativeStackLinking,
  },
  SimpleStack: {
    title: 'Simple Stack',
    component: SimpleStack,
    linking: simpleStackLinking,
  },
  ModalStack: {
    title: 'Modal Stack',
    component: ModalStack,
    linking: modalStackLinking,
  },
  MixedStack: {
    title: 'Regular + Modal Stack',
    component: MixedStack,
    linking: mixedStackLinking,
  },
  MixedHeaderMode: {
    title: 'Float + Screen Header Stack',
    component: MixedHeaderMode,
    linking: mixedHeaderStackLinking,
  },
  StackTransparent: {
    title: 'Transparent Stack',
    component: StackTransparent,
    linking: transparentStackLinking,
  },
  StackHeaderCustomization: {
    title: 'Header Customization in Stack',
    component: StackHeaderCustomization,
    linking: headerCustomizationStackLinking,
  },
  NativeStackHeaderCustomization: {
    title: 'Header Customization in Native Stack',
    component: NativeStackHeaderCustomization,
    linking: nativeHeaderCustomizationStackLinking,
  },
  BottomTabs: {
    title: 'Bottom Tabs',
    component: BottomTabs,
    linking: bottomTabLinking,
  },
  MaterialTopTabs: {
    title: 'Material Top Tabs',
    component: MaterialTopTabsScreen,
    linking: materialTopTabLinking,
  },
  DynamicTabs: {
    title: 'Dynamic Tabs',
    component: DynamicTabs,
    linking: dynamicBottomTabLinking,
  },
  MasterDetail: {
    title: 'Master Detail',
    component: MasterDetail,
    linking: masterDetailLinking,
  },
  AuthFlow: {
    title: 'Auth Flow',
    component: AuthFlow,
    linking: authLinking,
  },
  Layouts: {
    title: 'Custom Layout',
    component: LayoutsStack,
    linking: layoutsStackLinking,
  },
  StackPreventRemove: {
    title: 'Prevent removing screen in Stack',
    component: StackPreventRemove,
    linking: preventRemoveLinking,
  },
  NativeStackPreventRemove: {
    title: 'Prevent removing screen in Native Stack',
    component: NativeStackPreventRemove,
    linking: nativePreventRemoveLinking,
  },
  CustomLayout: {
    title: 'Custom Layout',
    component: CustomLayout,
    linking: customLayoutLinking,
  },
  LinkComponent: {
    title: '<Link />',
    component: LinkComponent,
    linking: linkComponentDemoLinking,
  },
  TabView: {
    title: 'TabView',
    component: TabView,
    linking: tabViewStackLinking,
  },
  DrawerView: {
    title: 'DrawerView',
    component: DrawerView,
    linking: {},
  },
  Static: {
    title: 'Static config',
    component: StaticScreen,
    linking: {},
  },
  Linking: {
    title: 'Linking with authentication flow',
    component: LinkingScreen,
    linking: linkingStackLinking,
  },
  PreloadFlowStack: {
    title: 'Preloading flow for Stack',
    component: StackPreloadFlow,
    linking: preloadStackLinking,
  },
  PreloadFlowTab: {
    title: 'Preloading flow for Bottom Tabs',
    component: TabPreloadFlow,
    linking: preloadBottomTabsLinking,
  },
} as const satisfies {
  [key: string]: {
    title: string;
    component: React.ComponentType<any>;
    linking: object;
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
