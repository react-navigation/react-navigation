import type { NavigatorScreenParams } from '@react-navigation/native';

import AuthFlow from './Screens/AuthFlow';
import BottomTabs from './Screens/BottomTabs';
import DynamicTabs from './Screens/DynamicTabs';
import LinkComponent from './Screens/LinkComponent';
import MasterDetail from './Screens/MasterDetail';
import MaterialBottomTabs from './Screens/MaterialBottomTabs';
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

export type RootDrawerParamList = {
  Examples: undefined;
};

export type LinkComponentDemoParamList = {
  Article: { author: string };
  Albums: undefined;
};

const paramsType = <params,>() => undefined as unknown as params;

export const SCREENS = {
  NativeStack: {
    title: 'Native Stack',
    component: NativeStack,
    params: undefined,
  },
  SimpleStack: {
    title: 'Simple Stack',
    component: SimpleStack,
    params: undefined,
  },
  ModalStack: {
    title: 'Modal Stack',
    component: ModalStack,
    params: undefined,
  },
  MixedStack: {
    title: 'Regular + Modal Stack',
    component: MixedStack,
    params: undefined,
  },
  MixedHeaderMode: {
    title: 'Float + Screen Header Stack',
    component: MixedHeaderMode,
    params: undefined,
  },
  StackTransparent: {
    title: 'Transparent Stack',
    component: StackTransparent,
    params: undefined,
  },
  StackHeaderCustomization: {
    title: 'Header Customization in Stack',
    component: StackHeaderCustomization,
    params: undefined,
  },
  NativeStackHeaderCustomization: {
    title: 'Header Customization in Native Stack',
    component: NativeStackHeaderCustomization,
    params: undefined,
  },
  BottomTabs: {
    title: 'Bottom Tabs',
    component: BottomTabs,
    params: undefined,
  },
  MaterialTopTabs: {
    title: 'Material Top Tabs',
    component: MaterialTopTabsScreen,
    params: undefined,
  },
  MaterialBottomTabs: {
    title: 'Material Bottom Tabs',
    component: MaterialBottomTabs,
    params: undefined,
  },
  DynamicTabs: {
    title: 'Dynamic Tabs',
    component: DynamicTabs,
    params: undefined,
  },
  MasterDetail: {
    title: 'Master Detail',
    component: MasterDetail,
    params: undefined,
  },
  AuthFlow: {
    title: 'Auth Flow',
    component: AuthFlow,
    params: undefined,
  },
  StackPreventRemove: {
    title: 'Prevent removing screen in Stack',
    component: StackPreventRemove,
    params: undefined,
  },
  NativeStackPreventRemove: {
    title: 'Prevent removing screen in Native Stack',
    component: NativeStackPreventRemove,
    params: undefined,
  },
  LinkComponent: {
    title: '<Link />',
    component: LinkComponent,
    params: paramsType<
      NavigatorScreenParams<LinkComponentDemoParamList> | undefined
    >(),
  },
};

export const SCREEN_NAMES = Object.keys(SCREENS) as (keyof typeof SCREENS)[];

export type RootStackParamList = {
  Home: undefined;
  NotFound: undefined;
} & {
  [P in keyof typeof SCREENS]: typeof SCREENS[P]['params'];
};

// Make the default RootParamList the same as the RootStackParamList
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
