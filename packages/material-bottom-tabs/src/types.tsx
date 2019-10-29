import { StyleProp, ViewStyle } from 'react-native';
import { BottomNavigation } from 'react-native-paper';
import {
  NavigationRoute,
  NavigationState,
  NavigationScreenProp,
  NavigationParams,
  NavigationScreenConfig,
  SupportedThemes,
} from 'react-navigation';

export type NavigationTabState = NavigationState;

export type NavigationTabProp<
  State = NavigationRoute,
  Params = NavigationParams
> = NavigationScreenProp<State, Params> & {
  jumpTo(routeName: string, key?: string): void;
};

export type NavigationMaterialBottomTabOptions = {
  title?: string;
  tabBarLabel?: React.ReactNode;
  tabBarBadge?: boolean | number | string;
  tabBarVisible?: boolean;
  tabBarAccessibilityLabel?: string;
  tabBarTestID?: string;
  tabBarColor?: string;
  tabBarIcon?:
    | React.ReactNode
    | ((props: {
        focused: boolean;
        tintColor?: string;
        horizontal?: boolean;
      }) => React.ReactNode);
  tabBarOnPress?: (props: {
    navigation: NavigationTabProp;
    defaultHandler: () => void;
  }) => void;
};

export type NavigationMaterialBottomTabConfig = Partial<
  Omit<
    React.ComponentProps<typeof BottomNavigation>,
    | 'navigationState'
    | 'onIndexChange'
    | 'onTabPress'
    | 'renderScene'
    | 'renderLabel'
    | 'renderIcon'
    | 'getAccessibilityLabel'
    | 'getBadge'
    | 'getColor'
    | 'getLabelText'
    | 'getTestID'
  >
> & {
  activeColorLight?: string;
  activeColorDark?: string;
  inactiveColorLight?: string;
  inactiveColorDark?: string;
  barStyleLight?: StyleProp<ViewStyle>;
  barStyleDark?: StyleProp<ViewStyle>;
};

export type NavigationTabScreenProps<
  Params = NavigationParams,
  ScreenProps = unknown
> = {
  theme: SupportedThemes;
  navigation: NavigationTabProp<NavigationRoute, Params>;
  screenProps: ScreenProps;
};

export type NavigationMaterialBottomTabScreenComponent<
  Params = NavigationParams,
  ScreenProps = unknown
> = React.ComponentType<NavigationTabScreenProps<Params, ScreenProps>> & {
  navigationOptions?: NavigationScreenConfig<
    NavigationMaterialBottomTabOptions,
    NavigationTabProp<NavigationRoute, Params>,
    ScreenProps
  >;
};
