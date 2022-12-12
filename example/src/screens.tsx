import type { NavigatorScreenParams } from '@react-navigation/native';

import AuthFlow from './Screens/AuthFlow';
import BottomTabs from './Screens/BottomTabs';
import DrawerView from './Screens/DrawerView';
import DynamicTabs from './Screens/DynamicTabs';
import LinkComponent from './Screens/LinkComponent';
import MasterDetail from './Screens/MasterDetail';
import MaterialTopTabsScreen from './Screens/MaterialTopTabs';
import MixedHeaderMode from './Screens/MixedHeaderMode';
import MixedStack from './Screens/MixedStack';
import ModalStack from './Screens/ModalStack';
import NativeStack from './Screens/NativeStack';
import NativeStackHeaderCustomization from './Screens/NativeStackHeaderCustomization';
import NativeStackPreventRemove from './Screens/NativeStackPreventRemove';
import SimpleStack from './Screens/SimpleStack';
import StackHeaderCustomization from './Screens/StackHeaderCustomization';
import StackPreventRemove from './Screens/StackPreventRemove';
import StackTransparent from './Screens/StackTransparent';
import StaticScreen from './Screens/Static';
import TabView from './Screens/TabView';

export type RootDrawerParamList = {
  Examples: undefined;
};

export type LinkComponentDemoParamList = {
  Article: { author: string };
  Albums: undefined;
};

export const SCREENS = {
  NativeStack: {
    title: 'Native Stack',
    component: NativeStack,
  },
  SimpleStack: {
    title: 'Simple Stack',
    component: SimpleStack,
  },
  ModalStack: {
    title: 'Modal Stack',
    component: ModalStack,
  },
  MixedStack: {
    title: 'Regular + Modal Stack',
    component: MixedStack,
  },
  MixedHeaderMode: {
    title: 'Float + Screen Header Stack',
    component: MixedHeaderMode,
  },
  StackTransparent: {
    title: 'Transparent Stack',
    component: StackTransparent,
  },
  StackHeaderCustomization: {
    title: 'Header Customization in Stack',
    component: StackHeaderCustomization,
  },
  NativeStackHeaderCustomization: {
    title: 'Header Customization in Native Stack',
    component: NativeStackHeaderCustomization,
  },
  BottomTabs: {
    title: 'Bottom Tabs',
    component: BottomTabs,
  },
  MaterialTopTabs: {
    title: 'Material Top Tabs',
    component: MaterialTopTabsScreen,
  },
  DynamicTabs: {
    title: 'Dynamic Tabs',
    component: DynamicTabs,
  },
  MasterDetail: {
    title: 'Master Detail',
    component: MasterDetail,
  },
  AuthFlow: {
    title: 'Auth Flow',
    component: AuthFlow,
  },
  StackPreventRemove: {
    title: 'Prevent removing screen in Stack',
    component: StackPreventRemove,
  },
  NativeStackPreventRemove: {
    title: 'Prevent removing screen in Native Stack',
    component: NativeStackPreventRemove,
  },
  LinkComponent: {
    title: '<Link />',
    component: LinkComponent,
  },
  TabView: {
    title: 'TabView',
    component: TabView,
  },
  DrawerView: {
    title: 'DrawerView',
    component: DrawerView,
  },
  Static: {
    title: 'Static config',
    component: StaticScreen,
  },
};

type ParamListTypes = {
  Home: undefined;
  NotFound: undefined;
  LinkComponent: NavigatorScreenParams<LinkComponentDemoParamList> | undefined;
};

export type RootStackParamList = {
  [P in Exclude<keyof typeof SCREENS, keyof ParamListTypes>]: undefined;
} & ParamListTypes;

// Make the default RootParamList the same as the RootStackParamList
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
