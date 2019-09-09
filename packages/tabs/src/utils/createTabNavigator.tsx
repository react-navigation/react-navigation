import * as React from 'react';
import {
  TabRouter,
  StackActions,
  SceneView,
  createNavigator,
  SwitchActions,
} from 'react-navigation';
import {
  NavigationProp,
  SceneDescriptor,
  Route,
  Screen,
  NavigationCommonTabOptions,
} from '../types';

type RouteConfig<Options> = {
  [key: string]:
    | Screen<Options>
    | ({ screen: Screen<Options> } | { getScreen(): Screen<Options> }) & {
        path?: string;
        navigationOptions?:
          | Options
          | ((options: { navigation: NavigationProp }) => Options);
      };
};

type CommonProps<Options> = {
  navigation: NavigationProp;
  descriptors: { [key: string]: SceneDescriptor<Options> };
  screenProps?: unknown;
};

type ExtraProps = {
  navigationConfig: any;
};

export type RenderIconProps = {
  route: Route;
  focused: boolean;
  tintColor?: string;
  horizontal?: boolean;
};

export type NavigationViewProps = {
  getLabelText: (props: { route: Route }) => string | undefined;
  getAccessibilityLabel: (props: { route: Route }) => string | undefined;
  getTestID: (props: { route: Route }) => string | undefined;
  renderIcon: (props: RenderIconProps) => React.ReactNode;
  renderScene: (props: { route: Route }) => React.ReactNode;
  onIndexChange: (index: number) => void;
  onTabPress: (props: { route: Route }) => void;
  onTabLongPress: (props: { route: Route }) => void;
};

export default function createTabNavigator<
  Options extends NavigationCommonTabOptions,
  Props extends NavigationViewProps & CommonProps<Options>
>(
  TabView: React.ComponentType<Props>
): (
  routes: RouteConfig<Options>,
  config: Options
) => React.ComponentType<
  Pick<Props, Exclude<keyof Props, keyof NavigationViewProps>> & ExtraProps
> {
  class NavigationView extends React.Component<
    Pick<Props, Exclude<keyof Props, keyof NavigationViewProps>> & ExtraProps
  > {
    _renderScene = ({ route }: { route: { key: string } }) => {
      const { screenProps, descriptors } = this.props;
      const descriptor = descriptors[route.key];
      const TabComponent = descriptor.getComponent();
      return (
        <SceneView
          screenProps={screenProps}
          navigation={descriptor.navigation}
          component={TabComponent}
        />
      );
    };

    _renderIcon = ({
      route,
      focused,
      tintColor,
      horizontal = false,
    }: RenderIconProps) => {
      const { descriptors } = this.props;
      const descriptor = descriptors[route.key];
      const options = descriptor.options;

      if (options.tabBarIcon) {
        return typeof options.tabBarIcon === 'function'
          ? options.tabBarIcon({ focused, tintColor, horizontal })
          : options.tabBarIcon;
      }

      return null;
    };

    _getLabelText = ({ route }: { route: Route }) => {
      const { descriptors } = this.props;
      const descriptor = descriptors[route.key];
      const options = descriptor.options;

      if (options.tabBarLabel) {
        return options.tabBarLabel;
      }

      if (typeof options.title === 'string') {
        return options.title;
      }

      return route.routeName;
    };

    _getAccessibilityLabel = ({ route }: { route: Route }) => {
      const { descriptors } = this.props;
      const descriptor = descriptors[route.key];
      const options = descriptor.options;

      if (typeof options.tabBarAccessibilityLabel !== 'undefined') {
        return options.tabBarAccessibilityLabel;
      }

      const label = this._getLabelText({ route });

      if (typeof label === 'string') {
        const { routes } = this.props.navigation.state;
        return `${label}, tab, ${routes.indexOf(route) + 1} of ${
          routes.length
        }`;
      }

      return undefined;
    };

    _getTestID = ({ route }: { route: Route }) => {
      const { descriptors } = this.props;
      const descriptor = descriptors[route.key];
      const options = descriptor.options;

      return options.tabBarTestID;
    };

    _makeDefaultHandler = ({
      route,
      navigation,
    }: {
      route: Route;
      navigation: NavigationProp;
    }) => () => {
      if (navigation.isFocused()) {
        if (route.hasOwnProperty('index') && route.index > 0) {
          // If current tab has a nested navigator, pop to top
          navigation.dispatch(StackActions.popToTop({ key: route.key }));
        } else {
          navigation.emit('refocus');
        }
      } else {
        this._jumpTo(route.routeName);
      }
    };

    _handleTabPress = ({ route }: { route: Route }) => {
      this._isTabPress = true;

      // After tab press, handleIndexChange will be called synchronously
      // So we reset it in promise callback
      Promise.resolve().then(() => (this._isTabPress = false));

      const { descriptors } = this.props;
      const descriptor = descriptors[route.key];
      const { navigation, options } = descriptor;

      const defaultHandler = this._makeDefaultHandler({ route, navigation });

      if (options.tabBarOnPress) {
        options.tabBarOnPress({ navigation, defaultHandler });
      } else {
        defaultHandler();
      }
    };

    _handleTabLongPress = ({ route }: { route: Route }) => {
      const { descriptors } = this.props;
      const descriptor = descriptors[route.key];
      const { navigation, options } = descriptor;

      const defaultHandler = this._makeDefaultHandler({ route, navigation });

      if (options.tabBarOnLongPress) {
        options.tabBarOnLongPress({ navigation, defaultHandler });
      } else {
        defaultHandler();
      }
    };

    _handleIndexChange = (index: number) => {
      if (this._isTabPress) {
        this._isTabPress = false;
        return;
      }

      this._jumpTo(this.props.navigation.state.routes[index].routeName);
    };

    _jumpTo = (routeName: string) => {
      const { navigation } = this.props;

      navigation.dispatch(
        SwitchActions.jumpTo({
          routeName,
          key: navigation.state.key,
        })
      );
    };

    _isTabPress: boolean = false;

    render() {
      const {
        descriptors,
        navigation,
        screenProps,
        navigationConfig,
      } = this.props;
      const { state } = navigation;
      const route = state.routes[state.index];
      const descriptor = descriptors[route.key];
      const options = {
        ...navigationConfig,
        ...descriptor.options,
      };

      return (
        <TabView
          {...options}
          getLabelText={this._getLabelText}
          getAccessibilityLabel={this._getAccessibilityLabel}
          getTestID={this._getTestID}
          renderIcon={this._renderIcon}
          renderScene={this._renderScene}
          onIndexChange={this._handleIndexChange}
          onTabPress={this._handleTabPress}
          onTabLongPress={this._handleTabLongPress}
          navigation={navigation}
          descriptors={descriptors}
          screenProps={screenProps}
        />
      );
    }
  }

  return (routes: RouteConfig<Options>, config: Partial<Options> = {}) => {
    const router = TabRouter(routes, config as any);

    // TODO: don't have time to fix it right now
    // @ts-ignore
    return createNavigator(NavigationView, router, config as any);
  };
}
