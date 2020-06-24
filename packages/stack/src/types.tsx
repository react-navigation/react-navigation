import type {
  NavigationRoute,
  NavigationParams,
  NavigationScreenConfig,
  SupportedThemes,
} from 'react-navigation';
import type {
  StackNavigationProp,
  StackNavigationOptions,
} from './vendor/types';

export type NavigationStackScreenProps<
  Params = NavigationParams,
  ScreenProps = unknown
> = {
  theme: SupportedThemes;
  navigation: StackNavigationProp<NavigationRoute, Params>;
  screenProps: ScreenProps;
};

export type NavigationStackScreenComponent<
  Params = NavigationParams,
  ScreenProps = unknown
> = React.ComponentType<NavigationStackScreenProps<Params, ScreenProps>> & {
  navigationOptions?: NavigationScreenConfig<
    StackNavigationOptions,
    StackNavigationProp<NavigationRoute, Params>,
    ScreenProps
  >;
};
