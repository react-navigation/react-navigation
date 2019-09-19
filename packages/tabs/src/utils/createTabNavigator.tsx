import * as React from 'react';
import {
  TabRouter,
  StackActions,
  SceneView,
  createNavigator,
  SwitchActions,
  NavigationRoute,
  NavigationRouteConfigMap,
  CreateNavigatorConfig,
  NavigationTabRouterConfig,
} from 'react-navigation';
import {
  NavigationTabProp,
  NavigationCommonTabOptions,
  SceneDescriptorMap,
} from '../types';

type RouteConfig<Options> = NavigationRouteConfigMap<
  Options,
  NavigationTabProp<NavigationRoute, any>
>;

type CommonProps = {
  navigation: NavigationTabProp;
  descriptors: SceneDescriptorMap;
  screenProps?: unknown;
};

type ExtraProps<Config extends {}> = {
  navigationConfig: Config;
};

export type RenderIconProps = {
  route: NavigationRoute;
  focused: boolean;
  tintColor?: string;
  horizontal?: boolean;
};

export type NavigationViewProps = {
  getLabelText: (props: { route: NavigationRoute }) => string | undefined;
  getAccessibilityLabel: (props: {
    route: NavigationRoute;
  }) => string | undefined;
  getTestID: (props: { route: NavigationRoute }) => string | undefined;
  renderIcon: (props: RenderIconProps) => React.ReactNode;
  renderScene: (props: { route: NavigationRoute }) => React.ReactNode;
  onIndexChange: (index: number) => void;
  onTabPress: (props: { route: NavigationRoute }) => void;
  onTabLongPress: (props: { route: NavigationRoute }) => void;
};

export default function createTabNavigator<
  Config extends {},
  Options extends NavigationCommonTabOptions,
  Props extends NavigationViewProps & CommonProps
>(TabView: React.ComponentType<Props & Config & Options>) {
  class NavigationView extends React.Component<
    Exclude<Props, NavigationViewProps> & ExtraProps<Config>
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

    _getLabelText = ({ route }: { route: NavigationRoute }) => {
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

    _getAccessibilityLabel = ({ route }: { route: NavigationRoute }) => {
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

    _getTestID = ({ route }: { route: NavigationRoute }) => {
      const { descriptors } = this.props;
      const descriptor = descriptors[route.key];
      const options = descriptor.options;

      return options.tabBarTestID;
    };

    _makeDefaultHandler = ({
      route,
      navigation,
    }: {
      route: NavigationRoute;
      navigation: NavigationTabProp;
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

    _handleTabPress = ({ route }: { route: NavigationRoute }) => {
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

    _handleTabLongPress = ({ route }: { route: NavigationRoute }) => {
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

      return (
        // TODO: don't have time to fix it right now
        // @ts-ignore
        <TabView
          {...navigationConfig}
          {...descriptor.options}
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

  return (
    routes: RouteConfig<Options>,
    config: CreateNavigatorConfig<
      Partial<Config>,
      NavigationTabRouterConfig,
      Partial<Options>,
      NavigationTabProp<NavigationRoute, any>
    > = {}
  ) => {
    const router = TabRouter(routes, config as any);

    return createNavigator(NavigationView as any, router, config as any);
  };
}
